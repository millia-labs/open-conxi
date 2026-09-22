import pathlib, subprocess, sys
import pytest

ROOT = pathlib.Path(__file__).resolve().parents[1]
LINT = ROOT / "scripts" / "lint.py"
FIX = ROOT / "tests" / "fixtures"

def run(*paths):
    return subprocess.run([sys.executable, str(LINT), *map(str, paths)], capture_output=True, text=True)

def test_good_skill_passes():
    r = run(FIX / "good-skill")
    assert r.returncode == 0, r.stdout + r.stderr

def test_name_mismatch_fails():
    r = run(FIX / "bad-name")
    assert r.returncode == 1
    assert "name 'wrong-name' does not match folder 'bad-name'" in r.stdout

def test_em_dash_fails(tmp_path):
    d = tmp_path / "dashy"; d.mkdir()
    src = (FIX / "good-skill" / "SKILL.md").read_text().replace("name: good-skill", "name: dashy")
    (d / "SKILL.md").write_text(src.replace("Text.", "Text — with a dash.", 1))
    r = run(d)
    assert r.returncode == 1 and "em dash" in r.stdout

def test_emoji_fails(tmp_path):
    d = tmp_path / "emo"; d.mkdir()
    src = (FIX / "good-skill" / "SKILL.md").read_text().replace("name: good-skill", "name: emo")
    (d / "SKILL.md").write_text(src.replace("Text.", "Text \U0001F600", 1))
    r = run(d)
    assert r.returncode == 1 and "emoji" in r.stdout

def test_missing_section_fails(tmp_path):
    d = tmp_path / "nosec"; d.mkdir()
    src = (FIX / "good-skill" / "SKILL.md").read_text().replace("name: good-skill", "name: nosec")
    (d / "SKILL.md").write_text(src.replace("## 4. Check yourself\nText.\n\n", ""))
    r = run(d)
    assert r.returncode == 1 and "section '## 4. Check yourself'" in r.stdout

def test_checklist_count(tmp_path):
    d = tmp_path / "short"; d.mkdir()
    src = (FIX / "good-skill" / "SKILL.md").read_text().replace("name: good-skill", "name: short")
    (d / "SKILL.md").write_text(src.replace("- [ ] four\n- [ ] five\n", ""))
    r = run(d)
    assert r.returncode == 1 and "checklist has 3 items" in r.stdout

def test_too_long_fails(tmp_path):
    d = tmp_path / "long"; d.mkdir()
    src = (FIX / "good-skill" / "SKILL.md").read_text().replace("name: good-skill", "name: long")
    (d / "SKILL.md").write_text(src + ("filler\n" * 140))
    r = run(d)
    assert r.returncode == 1 and "lines" in r.stdout

def _skill(tmp_path, name, extra_check="", extra_output=""):
    d = tmp_path / name; d.mkdir()
    src = (FIX / "good-skill" / "SKILL.md").read_text().replace("name: good-skill", f"name: {name}")
    src = src.replace("## 4. Check yourself\nText.\n", "## 4. Check yourself\nText.\n" + extra_check, 1)
    src = src.replace("## 5. Output\nText.\n", "## 5. Output\nText.\n" + extra_output, 1)
    (d / "SKILL.md").write_text(src)
    return d

def test_output_rules_line_must_be_canonical(tmp_path):
    import importlib.util
    spec = importlib.util.spec_from_file_location("lint", LINT); m = importlib.util.module_from_spec(spec); spec.loader.exec_module(m)
    ok = _skill(tmp_path, "rules-ok", extra_check=m.OUTPUT_RULES + "\n")
    (ok / "SKILL.md").write_text((ok / "SKILL.md").read_text().replace("## 2. Do\n", "## 2. Do\n" + m.PROFILE + "\n", 1))
    assert run(ok).returncode == 0, run(ok).stdout
    bad = _skill(tmp_path, "rules-bad", extra_check="- Output rules: be nice.\n")
    r = run(bad)
    assert r.returncode == 1 and "output rules line differs" in r.stdout

def test_delta_skill_needs_saving_line(tmp_path):
    import importlib.util
    spec = importlib.util.spec_from_file_location("lint", LINT); m = importlib.util.module_from_spec(spec); spec.loader.exec_module(m)
    delta = "\nhotel-data delta\n```json\n{}\n```\n"
    bad = _skill(tmp_path, "nosave", extra_output=delta)
    r = run(bad)
    assert r.returncode == 1 and "saving line missing" in r.stdout
    ok = _skill(tmp_path, "saves", extra_output=delta + m.SAVING + "\n")
    assert run(ok).returncode == 0, run(ok).stdout

def test_skill_must_read_profile(tmp_path):
    import importlib.util
    spec = importlib.util.spec_from_file_location("lint", LINT); m = importlib.util.module_from_spec(spec); spec.loader.exec_module(m)
    bad = _skill(tmp_path, "noprofile", extra_check=m.OUTPUT_RULES + "\n")
    r = run(bad)
    assert r.returncode == 1 and "profile line missing" in r.stdout
    src = (bad / "SKILL.md").read_text().replace("## 2. Do\n", "## 2. Do\n" + m.PROFILE + "\n", 1)
    (bad / "SKILL.md").write_text(src)
    assert run(bad).returncode == 0, run(bad).stdout

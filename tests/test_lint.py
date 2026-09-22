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

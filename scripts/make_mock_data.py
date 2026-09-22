import json, random, datetime as dt
random.seed(7)
K=120; d0=dt.date(2026,8,1)
kpis=[]
for i in range(31):
    d=d0+dt.timedelta(days=i); wk=d.weekday()>=4
    occ=round(random.uniform(0.74,0.91) if wk else random.uniform(0.62,0.80),3)
    adr=round(random.uniform(320,360) if wk else random.uniform(280,315))
    sold=round(occ*K); rev=sold*adr
    kpis.append({"date":d.isoformat(),"rooms_sold":sold,"occupancy":occ,"adr":adr,"revpar":round(rev/K),"trevpar":round(rev/K*1.18),"gop":None,
        "budget":{"occupancy":0.72,"adr":300,"revpar":216},"last_year":{"occupancy":round(occ-0.03,3),"adr":adr-14,"revpar":round((occ-0.03)*(adr-14))},"source":"morning-flash"})
pace=[]
for i in range(30):
    d=dt.date(2026,10,1)+dt.timedelta(days=i); otb=random.randint(38,96)
    pace.append({"stay_date":d.isoformat(),"otb_rooms":otb,"otb_adr":random.randint(285,345),"pickup_7d":random.randint(2,14),"cancellation_adjusted_otb":round(otb*0.85),"source":"rate-check"})
channels=[{"channel":c,"share":s,"effective_commission":e,"period":"2026-08","source":"ota-reconciliation"} for c,s,e in [("Direct",0.35,0.03),("Agoda",0.24,0.19),("Booking.com",0.21,0.17),("Trip.com",0.12,0.15),("Expedia",0.08,0.20)]]
reviews=[{"platform":p,"rating":r,"count":n,"period":"2026-08","top_positive":["breakfast","location","staff"],"top_negative":["aircon noise","slow check-in"],"source":"review-replies"} for p,r,n in [("Google",4.4,61),("Agoda",8.6,48),("Booking.com",8.5,52),("Trip.com",4.5,23),("TripAdvisor",4.3,17)]]
wo=[{"id":"WO-2609-001","priority":"P0","opened":"2026-09-02T06:40","sla_due":"2026-09-02T07:40","status":"resolved","location":"Level 5 riser, water leak","cost":2400,"source":"work-orders"},
    {"id":"WO-2609-014","priority":"P1","opened":"2026-09-21T07:10","sla_due":"2026-09-21T15:10","status":"in progress","location":"Room 512 aircon","cost":180,"source":"work-orders"},
    {"id":"WO-2609-015","priority":"P1","opened":"2026-09-21T09:30","sla_due":"2026-09-21T17:30","status":"assigned","location":"Room 318 door lock","cost":95,"source":"work-orders"},
    {"id":"WO-2609-009","priority":"P2","opened":"2026-09-17T11:00","sla_due":"2026-09-24T11:00","status":"open","location":"Room 204 grout","cost":150,"source":"work-orders"},
    {"id":"WO-2609-011","priority":"P2","opened":"2026-09-18T14:20","sla_due":"2026-09-25T14:20","status":"open","location":"Lift lobby L3 light","cost":40,"source":"work-orders"},
    {"id":"WO-2609-012","priority":"P2","opened":"2026-09-19T08:00","sla_due":"2026-09-26T08:00","status":"parts on order","location":"Row Kitchen fridge seal","cost":220,"source":"work-orders"}]
score=[{"name":n,"value":v,"target":t,"owner":o,"week":"2026-W38","source":s} for n,v,t,o,s in [
    ("Occupancy",0.81,0.72,"Daniel","owner-report"),("ADR",318,300,"Daniel","owner-report"),("RevPAR",258,216,"Daniel","owner-report"),
    ("Rooms ready by 15:00",0.92,1.0,"Kavitha","turnover-board"),("Work orders closed on time",0.83,0.9,"Ravi","work-orders"),
    ("Review rating (Google)",4.4,4.5,"Aina","review-replies"),("Labour cost per occupied room",62,60,"Daniel","staff-roster"),("Direct share",0.35,0.40,"Daniel","ota-reconciliation")]]
out={"schema_version":1,"profile_ref":"hotel-profile.md","updated_at":"2026-09-22T09:00:00+08:00","hotel":{"name":"The Ampang Row Hotel","currency":"MYR"},
     "kpis":kpis,"pace":pace,"channels":channels,"reviews":reviews,"work_orders":wo,"scorecard":score}
json.dump(out,open("mock/hotel-data.json","w"),indent=1)
print("rows",len(kpis),len(pace),len(channels),len(reviews),len(wo),len(score))

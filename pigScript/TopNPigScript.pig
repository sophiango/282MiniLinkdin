connData = load '/prInput/user_conn.csv' USING PigStorage(',') as (user:int,connId:int);
recoData = load '/prInput/user_loca_posi.csv' USING PigStorage(',') as (user:int,location:int,position1:int,company1:int,position2:int,company2:int,position3:int,company3:int,position4:int,company4:int);
A = foreach recoData generate user as connId, location as connLoca, position1 as connPosi1,company1 as connCompany1,position2 as connPosi2,company2 as connCompany2,position3 as connPosi3,company3 as connCompany3,position4 as connPosi4,company4 as connCompany4;
B = JOIN recoData by location, A by connLoca; 
C = filter B by user != connId;
D = cogroup C by (user,connId), connData by (user, connId);
E = FILTER D BY IsEmpty(connData);
F = FOREACH E GENERATE FLATTEN(C);
G = foreach F generate user, connId, (position1==connPosi1 ? 1 : (position1==connPosi2 ? 1 : (position1==connPosi3 ? 1 : (position1==connPosi4 ? 1 :0 ) ))) as Position1Cnt,
(position2==connPosi1 ? 1 : (position2==connPosi2 ? 1 : (position2==connPosi3 ? 1 : (position2==connPosi4 ? 1 :0 ) ))) as Position2Cnt,
(position3==connPosi1 ? 1 : (position3==connPosi2 ? 1 : (position3==connPosi3 ? 1 : (position3==connPosi4 ? 1 :0 ) ))) as Position3Cnt,
(position4==connPosi1 ? 1 : (position4==connPosi2 ? 1 : (position4==connPosi3 ? 1 : (position4==connPosi4 ? 1 :0 ) ))) as Position4Cnt,
(company1==connCompany1 ? 1 : (company1==connCompany2 ? 1 : (company1==connCompany3 ? 1 : (company1==connCompany4 ? 1 :0 ) ))) as Company1Cnt,
(company2==connCompany1 ? 1 : (company2==connCompany2 ? 1 : (company2==connCompany3 ? 1 : (company2==connCompany4 ? 1 :0 ) ))) as Company2Cnt,
(company3==connCompany1 ? 1 : (company3==connCompany2 ? 1 : (company3==connCompany3 ? 1 : (company3==connCompany4 ? 1 :0 ) ))) as Company3Cnt,
(company4==connCompany1 ? 1 : (company4==connCompany2 ? 1 : (company4==connCompany3 ? 1 : (company4==connCompany4 ? 1 :0 ) ))) as Company4Cnt;
H = foreach G generate user, connId,Position1Cnt+Position2Cnt+Position3Cnt+Position4Cnt+Company1Cnt+Company2Cnt+Company3Cnt+Company4Cnt+1 as rating;
I = GROUP H BY user;
J = foreach I {
        sorted = order H by rating DESC;
        top1    = limit sorted 2;
        generate flatten(top1);
};
STORE J INTO '/output' USING PigStorage(','); 
fs -copyToLocal /output out
fs -rmf /output

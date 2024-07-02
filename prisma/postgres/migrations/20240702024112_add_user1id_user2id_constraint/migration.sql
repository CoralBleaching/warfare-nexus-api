ALTER TABLE "Relationship"
ADD CONSTRAINT "user1id_less_than_user2id"
CHECK ("user1Id" < "user2Id");
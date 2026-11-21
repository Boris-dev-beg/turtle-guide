CREATE UNIQUE INDEX "admin_invitations_one_pending_per_email_key"
ON "admin_invitations" (LOWER("email"))
WHERE "status" = 'PENDING';

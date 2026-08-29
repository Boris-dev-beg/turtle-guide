
type User = {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    email: string;
    emailVerified: boolean;
    name: string;
    image?: string | null | undefined;
}


export default async function Diagnostic({user}:{user: User}) {
  return (
    <div>
      <p> userID: {user.id}</p>
      <p> userName: {user.name}</p>
      <p> userEmail: {user.email}</p>
    </div>
  );
}

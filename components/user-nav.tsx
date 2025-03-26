import { Button } from '@/components/ui/button';
import { useAuth } from './auth-provider';

export function UserNav() {
  const { user, signOut } = useAuth();

  return (
    <div className="flex items-center gap-4">
      <span className="text-sm text-muted-foreground">
        {user?.email}
      </span>
      <Button variant="outline" onClick={signOut}>
        Sign Out
      </Button>
    </div>
  );
}
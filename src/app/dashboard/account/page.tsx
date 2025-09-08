import * as React from 'react';
import { useEffect, useState } from 'react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Unstable_Grid2';

import { config } from '@/config';
import { AddTrain } from '@/components/dashboard/account/add-train';
import DeleteTrain from '@/components/dashboard/account/delete-train';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, getFirestore } from 'firebase/firestore';

function NotAuthorized() {
  return (
    <Stack spacing={2} alignItems="center" justifyContent="center" sx={{ mt: 10 }}>
      <Typography variant="h3" color="error">403</Typography>
      <Typography variant="h5">You are not authorized to access this page.</Typography>
    </Stack>
  );
}

export default function Page(): React.JSX.Element {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const auth = getAuth();
  const db = getFirestore();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setIsAdmin(false);
        return;
      }

      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (!userDoc.exists() || !userDoc.data().admin) {
        setIsAdmin(false);
        return;
      }

      setIsAdmin(true);
    });

    return () => unsubscribe();
  }, [auth, db]);

  if (isAdmin === null) return <div>Loading...</div>;
  if (isAdmin === false) return <NotAuthorized />;

  return (
    <Stack spacing={3}>
      <div>
        <Typography variant="h4">Add or Delete Trains</Typography>
      </div>
      <Grid container spacing={3}>
        <Grid lg={12} md={6} xs={12}><AddTrain /></Grid>
        <Grid lg={12} md={6} xs={12}><DeleteTrain /></Grid>
      </Grid>
    </Stack>
  );
}

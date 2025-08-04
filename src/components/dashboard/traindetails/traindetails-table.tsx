'use client'
import React, { useState, useEffect } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { Box, Chip, Typography, Collapse, IconButton, Button } from '@mui/material';
import { CaretDown as CaretDownIcon } from '@phosphor-icons/react/dist/ssr/CaretDown';
import { CaretUp as CaretUpIcon } from '@phosphor-icons/react/dist/ssr/CaretUp';
import { Download as DownloadIcon } from '@phosphor-icons/react/dist/ssr/Download';
import { db } from '@/lib/firebase';
import { onSnapshot, collection } from 'firebase/firestore';
import { Train } from '@/types/train';

interface TrainWithId extends Train {
  id: string;
}

function formatDateWithSuffix(dateString: string): string {
  if (!dateString || isNaN(new Date(dateString).getTime())) {
    return 'Invalid Date'; // Return a fallback value for invalid or undefined dates
  }

  const date = new Date(dateString);

  const day = date.getDate();
  const daySuffix = (day: number): string => {
    if (day >= 11 && day <= 13) return 'th';
    switch (day % 10) {
      case 1: return 'st';
      case 2: return 'nd';
      case 3: return 'rd';
      default: return 'th';
    }
  };

  const formatterDate = new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const formatterTime = new Intl.DateTimeFormat('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });

  const formattedDate = formatterDate.format(date); // Format the date part
  const formattedTime = formatterTime.format(date); // Format the time part

  // Extract the month, day, and year from the formatted date
  const [month, dayNumber, year] = formattedDate.replace(',', '').split(' ');

  return `${month} ${day}${daySuffix(day)}, ${year} at ${formattedTime}`;
}
export function TrainsTable(): React.JSX.Element {
  const [trains, setTrains] = useState<TrainWithId[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, 'trains'),
      (snapshot) => {
        const newTrains: TrainWithId[] = snapshot.docs.map(
          (doc) =>
            ({
              id: doc.id,
              ...doc.data(),
            } as TrainWithId)
        );
        setTrains(newTrains);
        setLoading(false);
      },
      (_) => {
        setLoading(false);
      }
    );

    return () => {
      unsubscribe();
    }; // Cleanup function
  }, []);

  const toggleRowExpansion = (trainId: string) => {
    const newExpandedRows = new Set(expandedRows);
    if (newExpandedRows.has(trainId)) {
      newExpandedRows.delete(trainId);
    } else {
      newExpandedRows.add(trainId);
    }
    setExpandedRows(newExpandedRows);
  };

  const downloadCSV = () => {
    // Create CSV headers
    const headers = [
      'Train No',
      'Train Name', 
      'From City',
      'To City',
      'Train Type',
      'Frequency',
      'Departure Date & Time',
      'Destination Date & Time',
      'Total Seats',
      'Class Type',
      'Class Seats Available',
      'Class Ticket Price'
    ];

    // Create CSV rows
    const csvRows = [];
    csvRows.push(headers.join(','));

    trains.forEach(train => {
      if (train.classes && train.classes.length > 0) {
        // Create a row for each class
        train.classes.forEach(trainClass => {
          const row = [
            `"${train.trainNo || ''}",`,
            `"${train.trainName || ''}",`,
            `"${train.fromCity || ''}",`,
            `"${train.toCity || ''}",`,
            `"${train.trainType || ''}",`,
            `"${train.frequency || ''}",`,
            `"${formatDateWithSuffix(train.departureDateTime) || ''}",`,
            `"${formatDateWithSuffix(train.destinationDateTime) || ''}",`,
            `"${train.totalSeats || 0}",`,
            `"${trainClass.classType || ''}",`,
            `"${trainClass.seatsAvailable || 0}",`,
            `"₹${trainClass.ticketPrice || 0}"`
          ];
          csvRows.push(row.join(''));
        });
      } else {
        // Create a single row if no classes
        const row = [
          `"${train.trainNo || ''}",`,
          `"${train.trainName || ''}",`,
          `"${train.fromCity || ''}",`,
          `"${train.toCity || ''}",`,
          `"${train.trainType || ''}",`,
          `"${train.frequency || ''}",`,
          `"${formatDateWithSuffix(train.departureDateTime) || ''}",`,
          `"${formatDateWithSuffix(train.destinationDateTime) || ''}",`,
          `"${train.totalSeats || 0}",`,
          `"No Classes",`,
          `"0",`,
          `"₹0"`
        ];
        csvRows.push(row.join(''));
      }
    });

    // Create and download the CSV file
    const csvContent = csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `train-details-${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Box>
      {/* Download CSV Button */}
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          variant="contained"
          startIcon={<DownloadIcon size={20} />}
          onClick={downloadCSV}
          disabled={trains.length === 0}
        >
          Download CSV
        </Button>
      </Box>
      
      <Table>
      <TableHead>
        <TableRow>
          <TableCell></TableCell>
          <TableCell>Train No</TableCell>
          <TableCell>Train Name</TableCell>
          <TableCell>Source</TableCell>
          <TableCell>Destination</TableCell>
          <TableCell>Total Seats</TableCell>
          <TableCell>Train Type</TableCell>
          <TableCell>Frequency</TableCell>
          <TableCell>Departure Date & Time</TableCell>
          <TableCell>Destination Date & Time</TableCell>
          <TableCell>Classes</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {trains.map((train) => (
          <React.Fragment key={train.id}>
            <TableRow>
              <TableCell>
                <IconButton
                  size="small"
                  onClick={() => toggleRowExpansion(train.id)}
                  aria-label="expand row"
                >
                  {expandedRows.has(train.id) ? <CaretUpIcon size={16} /> : <CaretDownIcon size={16} />}
                </IconButton>
              </TableCell>
              <TableCell>{train.trainNo}</TableCell>
              <TableCell>{train.trainName}</TableCell>
              <TableCell>{train.fromCity}</TableCell>
              <TableCell>{train.toCity}</TableCell>
              <TableCell>{train.totalSeats || 0}</TableCell>
              <TableCell>{train.trainType}</TableCell>
              <TableCell>{train.frequency}</TableCell>
              <TableCell>
                {formatDateWithSuffix(train.departureDateTime)}
              </TableCell>
              <TableCell>
                {formatDateWithSuffix(train.destinationDateTime)}
              </TableCell>
              <TableCell>
                <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                  {train.classes?.map((trainClass, index) => (
                    <Chip
                      key={index}
                      label={trainClass.classType}
                      size="small"
                      variant="outlined"
                    />
                  )) || <Typography variant="body2" color="text.secondary">No classes</Typography>}
                </Box>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={11}>
                <Collapse in={expandedRows.has(train.id)} timeout="auto" unmountOnExit>
                  <Box sx={{ margin: 1 }}>
                    <Typography variant="h6" gutterBottom component="div">
                      Class Details
                    </Typography>
                    <Table size="small" aria-label="class details">
                      <TableHead>
                        <TableRow>
                          <TableCell>Class Type</TableCell>
                          <TableCell align="right">Seats Available</TableCell>
                          <TableCell align="right">Ticket Price (₹)</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {train.classes?.map((trainClass, index) => (
                          <TableRow key={index}>
                            <TableCell component="th" scope="row">
                              {trainClass.classType}
                            </TableCell>
                            <TableCell align="right">{trainClass.seatsAvailable}</TableCell>
                            <TableCell align="right">₹{trainClass.ticketPrice}</TableCell>
                          </TableRow>
                        )) || (
                          <TableRow>
                            <TableCell colSpan={3}>
                              <Typography variant="body2" color="text.secondary">
                                No class information available
                              </Typography>
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </Box>
                </Collapse>
              </TableCell>
            </TableRow>
          </React.Fragment>
        ))}
      </TableBody>
    </Table>
    </Box>
  );
}
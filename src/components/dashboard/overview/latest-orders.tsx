'use client'
import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardHeader from '@mui/material/CardHeader';
import Divider from '@mui/material/Divider';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import { ArrowRight as ArrowRightIcon } from '@phosphor-icons/react/dist/ssr/ArrowRight';
import { DownloadSimple as DownloadIcon } from '@phosphor-icons/react/dist/ssr/DownloadSimple';
import { auth, db } from '@/lib/firebase';
import { collection, query, where, getDocs, doc, updateDoc, deleteDoc, getDoc } from 'firebase/firestore';
import { Train as TrainType, TrainClass } from '@/types/train';
// Add these imports at the top of the file
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

// Update the downloadTicketPDF function
const downloadTicketPDF = async (reservation: Reservation): Promise<void> => {
  // Create a temporary div to hold our ticket content
  const ticketDiv = document.createElement('div');
  ticketDiv.style.position = 'absolute';
  ticketDiv.style.left = '-9999px';
  ticketDiv.style.width = '600px';
  ticketDiv.style.padding = '20px';
  ticketDiv.style.boxSizing = 'border-box';
  ticketDiv.style.fontFamily = 'Arial, sans-serif';
  ticketDiv.style.backgroundColor = 'white';
  
  // Create the ticket HTML
  ticketDiv.innerHTML = `
    <div style="border: 2px solid #1976d2; border-radius: 10px; padding: 20px; max-width: 600px; margin: 0 auto;">
      <div style="text-align: center; border-bottom: 2px solid #1976d2; padding-bottom: 15px; margin-bottom: 20px;">
        <h1 style="color: #1976d2; font-size: 28px; font-weight: bold; margin: 0 0 5px 0;">🚂 RAILWAY TICKET</h1>
        <p style="color: #666; font-size: 16px; margin: 5px 0;">Reference No: ${reservation.referenceNo}</p>
      </div>
      
      <div style="text-align: center; font-size: 20px; font-weight: bold; color: #1976d2; margin: 20px 0;">
        ${reservation.fromCity} → ${reservation.toCity}
      </div>
      
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin: 20px 0;">
        <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; border-left: 4px solid #1976d2;">
          <div style="font-weight: bold; color: #333; margin-bottom: 5px;">Train Details</div>
          <div style="color: #666; font-size: 14px; margin: 5px 0;">Train: ${reservation.trainName}</div>
          <div style="color: #666; font-size: 14px; margin: 5px 0;">Train ID: ${reservation.trainId}</div>
          <div style="color: #666; font-size: 14px; margin: 5px 0;">Class: ${reservation.selectedClass}</div>
        </div>
        
        <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; border-left: 4px solid #1976d2;">
          <div style="font-weight: bold; color: #333; margin-bottom: 5px;">Passenger Details</div>
          <div style="color: #666; font-size: 14px; margin: 5px 0;">Email: ${reservation.email}</div>
          <div style="color: #666; font-size: 14px; margin: 5px 0;">Tickets: ${reservation.numTickets}</div>
          <div style="color: #666; font-size: 14px; margin: 5px 0;">Seat Preferences: ${reservation.seatPreferences?.join(', ') || 'None'}</div>
        </div>
        
        <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; border-left: 4px solid #1976d2;">
          <div style="font-weight: bold; color: #333; margin-bottom: 5px;">Booking Details</div>
          <div style="color: #666; font-size: 14px; margin: 5px 0;">Booking Date: ${new Date(reservation.dateTime).toLocaleDateString()}</div>
          <div style="color: #666; font-size: 14px; margin: 5px 0;">Booking Time: ${new Date(reservation.dateTime).toLocaleTimeString()}</div>
        </div>
        
        <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; border-left: 4px solid #1976d2;">
          <div style="font-weight: bold; color: #333; margin-bottom: 5px;">Payment Details</div>
          <div style="color: #666; font-size: 14px; margin: 5px 0;">Price per Ticket: ₹${reservation.ticketPrice}</div>
          <div style="color: #666; font-size: 14px; margin: 5px 0;">Total Amount: ₹${reservation.totalAmount}</div>
          <div style="color: #4caf50; font-size: 14px; margin: 5px 0; font-weight: bold;">Status: CONFIRMED</div>
        </div>
      </div>
      
      <div style="text-align: center; margin-top: 20px; padding-top: 20px; border-top: 1px solid #ddd; color: #666; font-size: 12px;">
        <div style="width: 100px; height: 100px; border: 2px dashed #ccc; margin: 10px auto; display: flex; align-items: center; justify-content: center; color: #999; font-size: 10px;">
          QR Code
        </div>
        <p>Please carry this ticket and a valid ID while traveling</p>
        <p>For support, contact: sohaumghosh@gmail.com</p>
      </div>
    </div>
  `;

  // Add the div to the document
  document.body.appendChild(ticketDiv);

  try {
    // Convert the div to a canvas
    const canvas = await html2canvas(ticketDiv, {
      scale: 2, // Higher quality
      useCORS: true,
      allowTaint: true,
      logging: false,
    });

    // Create PDF
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    
    // Save the PDF
    pdf.save(`Railway-Ticket-${reservation.referenceNo}.pdf`);
  } catch (error) {
    console.error('Error generating PDF:', error);
    alert('Error generating PDF. Please try again.');
  } finally {
    // Clean up
    document.body.removeChild(ticketDiv);
  }
};

export interface Reservation {
  referenceNo: string;
  email: string;
  trainId: string;
  trainName: string;
  fromCity: string;
  toCity: string;
  numTickets: number;
  selectedClass: string;
  ticketPrice: number;
  totalAmount: number;
  seatPreferences: string[];
  dateTime: string;
}

export interface TrainWithId extends TrainType {
  id: string;
}

export function LatestReservations(): React.JSX.Element {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);

  useEffect(() => {
    const fetchReservations = async (): Promise<void> => {
      try {
        setLoading(true);
        const user = auth.currentUser;
        const email = user?.email;
        if (user) {
          const q = query(collection(db, 'reservations'), where('email', '==', email));
          const querySnapshot = await getDocs(q);
          const newFetchedReservations: Reservation[] = querySnapshot.docs.map((docs) => ({
            referenceNo: docs.id,
            ...docs.data(),
          } as Reservation));
          setReservations(newFetchedReservations);
          setLoading(false);
        }
      } catch (error) {
        console.error('Error fetching reservations:', error);
        setLoading(false);
      }
    };
    fetchReservations();
  }, []);

  const handleOpenDialog = (reservation: Reservation): void => {
    setSelectedReservation(reservation);
    setOpenDialog(true);
  };

  const handleCloseDialog = (): void => {
    setOpenDialog(false);
    setSelectedReservation(null);
  };

  const confirmCancelReservation = async (): Promise<void> => {
    if (!selectedReservation) return;

    try {
      // Delete the reservation
      await deleteDoc(doc(collection(db, 'reservations'), selectedReservation.referenceNo));
      setReservations(reservations.filter((r) => r.referenceNo !== selectedReservation.referenceNo));

      // Update train seats available in the specific class
      const trainDoc = doc(db, 'trains', selectedReservation.trainId);
      const trainSnap = await getDoc(trainDoc);
      const train = trainSnap.data() as TrainWithId;
      
      // Update the specific class seats and recalculate total seats
      const updatedClasses = train.classes?.map(cls => 
        cls.classType === selectedReservation.selectedClass 
          ? { ...cls, seatsAvailable: cls.seatsAvailable + selectedReservation.numTickets }
          : cls
      ) || [];

      const newTotalSeats = updatedClasses.reduce((total, cls) => total + cls.seatsAvailable, 0);

      await updateDoc(trainDoc, {
        classes: updatedClasses,
        totalSeats: newTotalSeats,
      });

      alert('Reservation canceled successfully.');
    } catch (error) {
      console.error('Error canceling reservation:', error);
    } finally {
      handleCloseDialog();
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Card>
      <CardHeader title="Latest Reservations" />
      <Divider />
      <Box sx={{ overflowX: 'auto' }}>
        <Table sx={{ minWidth: 800 }}>
          <TableHead>
            <TableRow>
              <TableCell>Reference No</TableCell>
              <TableCell>Train Name</TableCell>
              <TableCell>Route</TableCell>
              <TableCell>Class</TableCell>
              <TableCell>Tickets</TableCell>
              <TableCell>Total Amount</TableCell>
              <TableCell>Booking Date</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {reservations.map((reservation) => (
              <TableRow key={reservation.referenceNo}>
                <TableCell>{reservation.referenceNo}</TableCell>
                <TableCell>{reservation.trainName || reservation.trainId}</TableCell>
                <TableCell>{reservation.fromCity} → {reservation.toCity}</TableCell>
                <TableCell>{reservation.selectedClass}</TableCell>
                <TableCell>{reservation.numTickets}</TableCell>
                <TableCell>₹{reservation.totalAmount}</TableCell>
                <TableCell>
                  {new Intl.DateTimeFormat('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true,
                  }).format(new Date(reservation.dateTime))}
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Tooltip title="Download Ticket">
                      <IconButton 
                        size="small" 
                        color="primary"
                        onClick={() => downloadTicketPDF(reservation)}
                      >
                        <DownloadIcon size={18} />
                      </IconButton>
                    </Tooltip>
                    <Button 
                      size="small" 
                      color="error" 
                      onClick={() => handleOpenDialog(reservation)}
                    >
                      Cancel
                    </Button>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>
      <Divider />
      <CardActions sx={{ justifyContent: 'flex-end' }}>
        <Button
          color="inherit"
          endIcon={<ArrowRightIcon fontSize="var(--icon-fontSize-md)" />}
          size="small"
          variant="text"
        >
          View all
        </Button>
      </CardActions>

      {/* Confirmation Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Cancel Reservation</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to cancel? Your payment is non-refundable.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            No
          </Button>
          <Button onClick={confirmCancelReservation} color="error" variant="contained">
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
}


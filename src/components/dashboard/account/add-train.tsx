'use client';

import * as React from 'react';
import { useState } from 'react';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Divider from '@mui/material/Divider';
import Alert from '@mui/material/Alert';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import Grid from '@mui/material/Unstable_Grid2';
import { doc, setDoc } from "firebase/firestore";
import { db } from '@/lib/firebase';
import { Select, MenuItem, Typography, IconButton, Box } from '@mui/material';
import { Plus as PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus';
import { Trash as TrashIcon } from '@phosphor-icons/react/dist/ssr/Trash';

interface TrainClass {
  classType: string;
  seatsAvailable: number;
  ticketPrice: number;
}

export function AddTrain(): React.JSX.Element {
  const [trainNo, setTrainNo] = useState('');
  const [trainName, setTrainName] = useState('');
  const [fromCity, setFromCity] = useState('');
  const [toCity, setToCity] = useState('');
  const [trainType, setTrainType] = useState('');
  const [frequency, setFrequency] = useState('');
  const [departureDateTime, setDepartureDateTime] = useState('');
  const [destinationDateTime, setDestinationDateTime] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  
  // Class-based categorization state
  const [classes, setClasses] = useState<TrainClass[]>([
    { classType: 'Sleeper', seatsAvailable: 110, ticketPrice: 670 },
    { classType: 'AC 3-Tier', seatsAvailable: 55, ticketPrice: 1250 },
    { classType: 'AC 2-Tier', seatsAvailable: 28, ticketPrice: 1950 },
    { classType: 'AC First Class', seatsAvailable: 6, ticketPrice: 3100 },
  ]);

  const availableClassTypes = [
    'Sleeper', 'AC 3-Tier', 'AC 2-Tier', 'AC First Class', 
    'General', '2S', 'CC', 'EC', 'SL'
  ];

  const addNewClass = () => {
    setClasses([...classes, { classType: 'Sleeper', seatsAvailable: 0, ticketPrice: 0 }]);
  };

  const removeClass = (index: number) => {
    if (classes.length > 1) {
      setClasses(classes.filter((_, i) => i !== index));
    }
  };

  const updateClass = (index: number, field: keyof TrainClass, value: string | number) => {
    const updatedClasses = classes.map((cls, i) => 
      i === index ? { ...cls, [field]: value } : cls
    );
    setClasses(updatedClasses);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();

    // Extract form data
    const formData = new FormData(event.target as HTMLFormElement);
    const trainNo1 = formData.get('trainNo') as string;
    const trainName1 = formData.get('train') as string;
    const fromCity1 = formData.get('city') as string;
    const toCity1 = formData.get('toCity') as string;
    const trainType1 = formData.get('trainType') as string;
    const frequency1 = formData.get('frequency') as string;
    const departureDateTime1 = formData.get('departureDateTime') as string;
    const destinationDateTime1 = formData.get('destinationDateTime') as string;

    // Calculate total seats across all classes
    const totalSeats = classes.reduce((sum, cls) => sum + cls.seatsAvailable, 0);

    // Construct train data object with class-based structure
    const trainData = {
      trainNo: trainNo1,
      trainName: trainName1,
      fromCity: fromCity1,
      toCity: toCity1,
      trainType: trainType1,
      frequency: frequency1,
      departureDateTime: departureDateTime1,
      destinationDateTime: destinationDateTime1,
      totalSeats,
      classes: classes,
    };

    // Save data to Firestore
    try {
      await setDoc(doc(db, "trains", trainName1), trainData);
      // Reset the form fields after successful submission
      setTrainNo('');
      setTrainName('');
      setFromCity('');
      setToCity('');
      setTrainType('');
      setFrequency('');
      setDepartureDateTime('');
      setDestinationDateTime('');
      // Reset classes to default
      setClasses([
        { classType: 'Sleeper', seatsAvailable: 110, ticketPrice: 670 },
        { classType: 'AC 3-Tier', seatsAvailable: 55, ticketPrice: 1250 },
        { classType: 'AC 2-Tier', seatsAvailable: 28, ticketPrice: 1950 },
        { classType: 'AC First Class', seatsAvailable: 6, ticketPrice: 3100 },
      ]);
      setSuccessMessage('Train details saved successfully!');
      // Remove success message after 3 seconds
      setTimeout(() => { setSuccessMessage(''); }, 3000);
      // Reset form safely
      if (event.currentTarget) {
        event.currentTarget.reset();
      }
    } catch (error) {
      console.error("Error saving train details:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader subheader="The information can be edited" title="Add Train Details" />
        <Divider />
        <CardContent>
          <Grid container spacing={3}>
            <Grid md={6} xs={12}>
              <FormControl fullWidth required>
                <InputLabel>Train Number</InputLabel>
                <OutlinedInput label="Train Number" name="trainNo" value={trainNo} onChange={(e) => { setTrainNo(e.target.value) }} />
              </FormControl>
            </Grid>
            <Grid md={6} xs={12}>
              <FormControl fullWidth required>
                <InputLabel>Train Name</InputLabel>
                <OutlinedInput label="Train name" name="train" value={trainName} onChange={(e) => { setTrainName(e.target.value) }} />
              </FormControl>
            </Grid>
            <Grid md={6} xs={12}>
              <FormControl fullWidth required>
                <InputLabel>From City</InputLabel>
                <OutlinedInput label="From City" name="city" value={fromCity} onChange={(e) => { setFromCity(e.target.value) }} />
              </FormControl>
            </Grid>
            <Grid md={6} xs={12}>
              <FormControl fullWidth required>
                <InputLabel>To City</InputLabel>
                <OutlinedInput label="To City" name="toCity" type="text" value={toCity} onChange={(e) => { setToCity(e.target.value) }} />
              </FormControl>
            </Grid>

            <Grid md={6} xs={12}>
              <FormControl fullWidth required>
                <InputLabel>Train Type</InputLabel>
                <Select
                  label="Train Type"
                  name="trainType"
                  value={trainType}
                  onChange={(e) => { setTrainType(e.target.value) }}
                >
                  <MenuItem value="Express">Express</MenuItem>
                  <MenuItem value="Super Fast">Super Fast</MenuItem>
                  <MenuItem value="Mail">Mail</MenuItem>
                  <MenuItem value="Slow">Slow</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid md={6} xs={12}>
              <FormControl fullWidth required>
                <InputLabel>Frequency</InputLabel>
                <Select
                  label="Frequency"
                  name="frequency"
                  value={frequency}
                  onChange={(e) => { setFrequency(e.target.value) }}
                >
                  <MenuItem value="Daily">Daily</MenuItem>
                  <MenuItem value="Weekly">Weekly</MenuItem>
                  <MenuItem value="Monthly">Monthly</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid md={6} xs={12}>
              <FormControl fullWidth required>
                <InputLabel shrink>Departure Date & Time</InputLabel>
                <OutlinedInput
                  label="Departure Date & Time"
                  name="departureDateTime"
                  type="datetime-local"
                  value={departureDateTime}
                  onChange={(e) => setDepartureDateTime(e.target.value)}
                />
              </FormControl>
            </Grid>
            <Grid md={6} xs={12}>
              <FormControl fullWidth required>
                <InputLabel shrink>Destination Date & Time</InputLabel>
                <OutlinedInput
                  label="Destination Date & Time"
                  name="destinationDateTime"
                  type="datetime-local"
                  value={destinationDateTime}
                  onChange={(e) => setDestinationDateTime(e.target.value)}
                />
              </FormControl>
            </Grid>

            {/* Class-based categorization section */}
            <Grid xs={12}>
              <Box sx={{ mt: 2, mb: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Train Classes & Pricing
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Configure different class types with their seat availability and pricing
                </Typography>
                
                {classes.map((trainClass, index) => (
                  <Box key={index} sx={{ mb: 2, p: 2, border: '1px solid #e0e0e0', borderRadius: 1 }}>
                    <Grid container spacing={2} alignItems="center">
                      <Grid xs={12} sm={3}>
                        <FormControl fullWidth required>
                          <InputLabel>Class Type</InputLabel>
                          <Select
                            value={trainClass.classType}
                            label="Class Type"
                            onChange={(e) => updateClass(index, 'classType', e.target.value)}
                          >
                            {availableClassTypes.map((type) => (
                              <MenuItem key={type} value={type}>{type}</MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Grid>
                      <Grid xs={12} sm={3}>
                        <FormControl fullWidth required>
                          <InputLabel>Seats Available</InputLabel>
                          <OutlinedInput
                            label="Seats Available"
                            type="number"
                            value={trainClass.seatsAvailable}
                            onChange={(e) => updateClass(index, 'seatsAvailable', parseInt(e.target.value) || 0)}
                          />
                        </FormControl>
                      </Grid>
                      <Grid xs={12} sm={3}>
                        <FormControl fullWidth required>
                          <InputLabel>Ticket Price (₹)</InputLabel>
                          <OutlinedInput
                            label="Ticket Price (₹)"
                            type="number"
                            value={trainClass.ticketPrice}
                            onChange={(e) => updateClass(index, 'ticketPrice', parseInt(e.target.value) || 0)}
                          />
                        </FormControl>
                      </Grid>
                      <Grid xs={12} sm={3}>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          {index === classes.length - 1 && (
                            <IconButton
                              color="primary"
                              onClick={addNewClass}
                              aria-label="Add new class"
                            >
                              <PlusIcon size={20} />
                            </IconButton>
                          )}
                          {classes.length > 1 && (
                            <IconButton
                              color="error"
                              onClick={() => removeClass(index)}
                              aria-label="Remove class"
                            >
                              <TrashIcon size={20} />
                            </IconButton>
                          )}
                        </Box>
                      </Grid>
                    </Grid>
                  </Box>
                ))}
                
                <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Total Seats:</strong> {classes.reduce((sum, cls) => sum + cls.seatsAvailable, 0)}
                  </Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
        <Divider />
        <CardActions sx={{ justifyContent: 'flex-end' }}>
          <Button type="submit" variant="contained">Save details</Button>
        </CardActions>
        {successMessage ? <Alert severity="success">{successMessage}</Alert> : null}
      </Card>
    </form>
  );
}
import { useEffect, useState } from "react";
import { Alert, Box, CircularProgress, Typography } from "@mui/material";
import { useParams } from "react-router-dom";

import FemaleIcon from "@mui/icons-material/Female";
import MaleIcon from "@mui/icons-material/Male";
import TransgenderIcon from "@mui/icons-material/Transgender";

import patientService from "../../services/patients";
import type { Patient } from "../../types";

const PatientPage = () => {
  const { id } = useParams<{ id: string }>();
  const [patient, setPatient] = useState<Patient>();
  const [error, setError] = useState<string>();

  useEffect(() => {
    if (!id) {
      return;
    }

    const fetchPatient = async () => {
      try {
        setError(undefined);
        setPatient(await patientService.getOne(id));
      } catch {
        setError("Patient could not be found");
      }
    };

    void fetchPatient();
  }, [id]);

  if (!id) {
    return <Alert severity="error">Patient ID is missing</Alert>;
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  if (!patient) {
    return <CircularProgress />;
  }

  const GenderIcon =
    patient.gender === "male"
      ? MaleIcon
      : patient.gender === "female"
        ? FemaleIcon
        : TransgenderIcon;

  return (
    <Box>
      <Typography
        variant="h4"
        gutterBottom
        sx={{ display: "flex", alignItems: "center", gap: 1 }}
      >
        {patient.name}
        <GenderIcon aria-label={patient.gender} fontSize="inherit" />
      </Typography>
      <Typography>SSN: {patient.ssn}</Typography>
      <Typography>Occupation: {patient.occupation}</Typography>
      <Typography>Date of birth: {patient.dateOfBirth}</Typography>
    </Box>
  );
};

export default PatientPage;

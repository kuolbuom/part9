import { useEffect, useState } from "react";
import { Alert, Box, CircularProgress, Typography } from "@mui/material";
import FemaleIcon from "@mui/icons-material/Female";
import MaleIcon from "@mui/icons-material/Male";
import TransgenderIcon from "@mui/icons-material/Transgender";
import { useParams } from "react-router-dom";

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
      <Typography>Occupation: {patient.occupation}</Typography>
      <Typography>Date of birth: {patient.dateOfBirth}</Typography>
      <Typography>SSN: {patient.ssn}</Typography>
      <Typography variant="h5" sx={{ marginTop: 3 }}>
        Entries
      </Typography>
      {patient.entries.length === 0 ? (
        <Typography>No entries yet.</Typography>
      ) : (
        patient.entries.map((entry) => (
          <Box key={entry.id} sx={{ marginTop: 2 }}>
            <Typography>{entry.date}</Typography>
            <Typography>{entry.description}</Typography>
            {entry.diagnosisCodes && entry.diagnosisCodes.length > 0 ? (
              <Box component="ul" sx={{ marginTop: 0 }}>
                {entry.diagnosisCodes.map((code) => (
                  <li key={code}>{code}</li>
                ))}
              </Box>
            ) : (
              <Typography>None</Typography>
            )}
          </Box>
        ))
      )}
    </Box>
  );
};

export default PatientPage;

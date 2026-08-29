import { useEffect, useState } from "react";
import { Alert, Box, CircularProgress, Stack, Typography } from "@mui/material";
import FemaleIcon from "@mui/icons-material/Female";
import MaleIcon from "@mui/icons-material/Male";
import MedicalServicesIcon from "@mui/icons-material/MedicalServices";
import MonitorHeartIcon from "@mui/icons-material/MonitorHeart";
import TransgenderIcon from "@mui/icons-material/Transgender";
import WorkIcon from "@mui/icons-material/Work";
import { useParams } from "react-router-dom";

import patientService from "../../services/patients";
import type { Diagnosis, Entry, Patient } from "../../types";

interface Props {
  diagnoses: Diagnosis[];
}

const assertNever = (value: never): never => {
  throw new Error(`Unhandled entry type: ${JSON.stringify(value)}`);
};

const renderDiagnosisCodes = (entry: Entry, diagnoses: Diagnosis[]) => (
  <Box component="div" sx={{ marginTop: 1 }}>
    {entry.diagnosisCodes && entry.diagnosisCodes.length > 0 ? (
      <Box component="ul" sx={{ margin: 0, paddingLeft: 3 }}>
        {entry.diagnosisCodes.map((code) => (
          <li key={code}>
            {code}:{" "}
            {diagnoses.find((d) => d.code === code)?.name ??
              "Unknown diagnosis"}
          </li>
        ))}
      </Box>
    ) : (
      <Typography variant="body2">No diagnosis codes</Typography>
    )}
  </Box>
);

const renderEntryIcon = (entry: Entry) => {
  switch (entry.type) {
    case "Hospital":
      return <MedicalServicesIcon fontSize="small" color="primary" />;
    case "OccupationalHealthcare":
      return <WorkIcon fontSize="small" color="primary" />;
    case "HealthCheck":
      return <MonitorHeartIcon fontSize="small" color="success" />;
    default:
      return null;
  }
};

const EntryDetails = ({
  entry,
  diagnoses,
}: {
  entry: Entry;
  diagnoses: Diagnosis[];
}) => {
  switch (entry.type) {
    case "Hospital":
      return (
        <Box sx={{ marginTop: 1 }}>
          <Typography>
            Discharge: {entry.discharge.date} — {entry.discharge.criteria}
          </Typography>
          {renderDiagnosisCodes(entry, diagnoses)}
        </Box>
      );
    case "OccupationalHealthcare":
      return (
        <Box sx={{ marginTop: 1 }}>
          <Typography>Employer: {entry.employerName}</Typography>
          {entry.sickLeave && (
            <Typography>
              Sick leave: {entry.sickLeave.startDate} -{" "}
              {entry.sickLeave.endDate}
            </Typography>
          )}
          {renderDiagnosisCodes(entry, diagnoses)}
        </Box>
      );
    case "HealthCheck":
      return (
        <Box sx={{ marginTop: 1 }}>
          <Typography>
            Health check rating: {entry.healthCheckRating}
          </Typography>
          {renderDiagnosisCodes(entry, diagnoses)}
        </Box>
      );
    default:
      return assertNever(entry);
  }
};

const PatientPage = ({ diagnoses }: Props) => {
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
          <Box
            key={entry.id}
            sx={{
              marginTop: 2,
              border: "2px solid rgba(0, 0, 0, 0.2)",
              borderRadius: 2,
              padding: 1,
              paddingTop: 1,
            }}
          >
            <Stack direction="row" spacing={1} alignItems="center">
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                {entry.date}
              </Typography>
              {renderEntryIcon(entry)}
            </Stack>
            <Typography>{entry.description}</Typography>
            <Typography variant="body2">
              diagnose by {entry.specialist}
            </Typography>
            <EntryDetails entry={entry} diagnoses={diagnoses} />
          </Box>
        ))
      )}
    </Box>
  );
};

export default PatientPage;

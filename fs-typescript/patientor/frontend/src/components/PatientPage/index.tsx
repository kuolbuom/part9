import { useEffect, useState, type SyntheticEvent } from "react";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Link,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import FemaleIcon from "@mui/icons-material/Female";
import MaleIcon from "@mui/icons-material/Male";
import MedicalServicesIcon from "@mui/icons-material/MedicalServices";
import MonitorHeartIcon from "@mui/icons-material/MonitorHeart";
import TransgenderIcon from "@mui/icons-material/Transgender";
import WorkIcon from "@mui/icons-material/Work";
import { Link as RouterLink, useParams } from "react-router-dom";

import patientService from "../../services/patients";
import type {
  Diagnosis,
  Entry,
  HealthCheckEntryFormValues,
  Patient,
} from "../../types";

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
  const [formError, setFormError] = useState<string>();
  const [showEntryForm, setShowEntryForm] = useState(false);
  const [entryForm, setEntryForm] = useState({
    description: "",
    date: "",
    specialist: "",
    diagnosisCodes: "",
    healthCheckRating: "",
  });

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

  const handleEntrySubmit = async (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!id || !patient) {
      return;
    }

    const rating = Number(entryForm.healthCheckRating);
    if (!Number.isInteger(rating) || rating < 0 || rating > 3) {
      setFormError("healthCheckRating: Invalid input");
      return;
    }

    setFormError(undefined);

    const payload: HealthCheckEntryFormValues = {
      type: "HealthCheck",
      description: entryForm.description,
      date: entryForm.date,
      specialist: entryForm.specialist,
      diagnosisCodes: entryForm.diagnosisCodes
        .split(",")
        .map((code) => code.trim())
        .filter(Boolean),
      healthCheckRating: rating,
    };

    try {
      setError(undefined);
      const newEntry = await patientService.addEntry(id, payload);
      setPatient((current) =>
        current
          ? { ...current, entries: current.entries.concat(newEntry) }
          : current,
      );
      setShowEntryForm(false);
      setEntryForm({
        description: "",
        date: "",
        specialist: "",
        diagnosisCodes: "",
        healthCheckRating: "",
      });
    } catch (error: unknown) {
      const backendError =
        typeof error === "object" && error !== null && "response" in error
          ? (error as { response?: { data?: { error?: unknown } } }).response
              ?.data?.error
          : undefined;

      if (Array.isArray(backendError)) {
        const issue = backendError.find(
          (entry) =>
            typeof entry === "object" &&
            entry !== null &&
            "path" in entry &&
            Array.isArray((entry as { path?: unknown[] }).path) &&
            (entry as { path?: unknown[] }).path?.includes("healthCheckRating"),
        );

        if (
          issue &&
          typeof issue === "object" &&
          issue !== null &&
          "message" in issue
        ) {
          setFormError(
            `healthCheckRating: ${(issue as { message?: string }).message}`,
          );
          return;
        }
      }

      if (
        typeof backendError === "string" &&
        backendError.toLowerCase().includes("healthcheckrating")
      ) {
        setFormError("healthCheckRating: Invalid input");
        return;
      }

      setError("Entry could not be added");
    }
  };

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
              borderTop: "1px solid rgba(0, 0, 0, 0.2)",
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

      {!showEntryForm ? (
        <Button
          variant="contained"
          sx={{ marginTop: 2 }}
          onClick={() => setShowEntryForm(true)}
        >
          Add new entry
        </Button>
      ) : (
        <Box
          component="form"
          onSubmit={handleEntrySubmit}
          sx={{
            marginTop: 2,
            border: 2,
            borderStyle: "dotted",
            padding: 3,
            borderRadius: 1,
          }}
        >
          <Typography variant="h5" sx={{ marginBottom: 2 }}>
            New HealthCheck Entry
          </Typography>
          {formError && (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                width: "fit-content",
                maxWidth: "100%",
                padding: "4px 10px",
                borderRadius: 1,
                backgroundColor: "#fdecea",
                border: "1px solid #f44336",
                color: "#d32f2f",
                marginBottom: 2,
              }}
            >
              <Box
                component="span"
                sx={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 18,
                  height: 18,
                  borderRadius: "50%",
                  backgroundColor: "#d32f2f",
                  color: "#fff",
                  fontSize: 12,
                  fontWeight: 700,
                  lineHeight: 1,
                }}
              >
                !
              </Box>
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                {formError}
              </Typography>
            </Box>
          )}
          <Stack spacing={2}>
            <TextField
              label="Date"
              value={entryForm.date}
              onChange={({ target }) => {
                setEntryForm((current) => ({ ...current, date: target.value }));
                setFormError(undefined);
              }}
              required
            />
            <TextField
              label="Description"
              value={entryForm.description}
              onChange={({ target }) => {
                setEntryForm((current) => ({
                  ...current,
                  description: target.value,
                }));
                setFormError(undefined);
              }}
              required
            />
            <TextField
              label="Specialist"
              value={entryForm.specialist}
              onChange={({ target }) => {
                setEntryForm((current) => ({
                  ...current,
                  specialist: target.value,
                }));
                setFormError(undefined);
              }}
              required
            />
            <TextField
              label="Diagnosis codes (comma separated)"
              value={entryForm.diagnosisCodes}
              onChange={({ target }) => {
                setEntryForm((current) => ({
                  ...current,
                  diagnosisCodes: target.value,
                }));
                setFormError(undefined);
              }}
            />
            <TextField
              label="Health check rating"
              type="number"
              value={entryForm.healthCheckRating}
              onChange={({ target }) => {
                const value = target.value;
                setEntryForm((current) => ({
                  ...current,
                  healthCheckRating: value,
                }));

                if (value === "") {
                  setFormError(undefined);
                  return;
                }

                const numericValue = Number(value);
                if (
                  !Number.isInteger(numericValue) ||
                  numericValue < 0 ||
                  numericValue > 3
                ) {
                  setFormError("healthCheckRating: Invalid input");
                } else {
                  setFormError(undefined);
                }
              }}
              slotProps={{ htmlInput: { min: 0, max: 3 } }}
              required
            />
            <Stack direction="row" spacing={2}>
              <Button type="submit" variant="contained">
                ADD
              </Button>
              <Button
                variant="outlined"
                onClick={() => {
                  setShowEntryForm(false);
                  setFormError(undefined);
                }}
              >
                Cancel
              </Button>
            </Stack>
          </Stack>
        </Box>
      )}

      <Link
        component={RouterLink}
        to="/"
        sx={{ display: "inline-block", marginTop: 2 }}
      >
        Back to patient list
      </Link>
    </Box>
  );
};

export default PatientPage;

import { useEffect, useState, type SyntheticEvent } from "react";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  MenuItem,
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
import { useParams } from "react-router-dom";

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

type EntryType = "HealthCheck" | "OccupationalHealthcare" | "Hospital";

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
  const [entryType, setEntryType] = useState<EntryType>("HealthCheck");
  const [entryForm, setEntryForm] = useState({
    description: "",
    date: "",
    specialist: "",
    diagnosisCodes: [] as string[],
    healthCheckRating: "",
    employerName: "",
    sickLeaveStartDate: "",
    sickLeaveEndDate: "",
    dischargeDate: "",
    dischargeCriteria: "",
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

  const resetEntryForm = () => {
    setEntryType("HealthCheck");
    setEntryForm({
      description: "",
      date: "",
      specialist: "",
      diagnosisCodes: [],
      healthCheckRating: "",
      employerName: "",
      sickLeaveStartDate: "",
      sickLeaveEndDate: "",
      dischargeDate: "",
      dischargeCriteria: "",
    });
    setFormError(undefined);
  };

  const handleEntrySubmit = async (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!id || !patient) {
      return;
    }

    const baseEntry = {
      description: entryForm.description,
      date: entryForm.date,
      specialist: entryForm.specialist,
      diagnosisCodes: entryForm.diagnosisCodes,
    };

    let payload: Record<string, unknown>;

    if (entryType === "HealthCheck") {
      const rating = Number(entryForm.healthCheckRating);
      if (!Number.isInteger(rating) || rating < 0 || rating > 3) {
        setFormError("healthCheckRating: Invalid input");
        return;
      }

      payload = {
        type: "HealthCheck",
        ...baseEntry,
        healthCheckRating: rating,
      };
    } else if (entryType === "OccupationalHealthcare") {
      if (!entryForm.employerName.trim()) {
        setFormError("employerName: Invalid input");
        return;
      }

      const sickLeave =
        entryForm.sickLeaveStartDate || entryForm.sickLeaveEndDate
          ? {
              startDate: entryForm.sickLeaveStartDate,
              endDate: entryForm.sickLeaveEndDate,
            }
          : undefined;

      payload = {
        type: "OccupationalHealthcare",
        ...baseEntry,
        employerName: entryForm.employerName,
        ...(sickLeave ? { sickLeave } : {}),
      };
    } else {
      if (!entryForm.dischargeDate || !entryForm.dischargeCriteria.trim()) {
        setFormError("discharge: Invalid input");
        return;
      }

      payload = {
        type: "Hospital",
        ...baseEntry,
        discharge: {
          date: entryForm.dischargeDate,
          criteria: entryForm.dischargeCriteria,
        },
      };
    }

    setFormError(undefined);

    try {
      setError(undefined);
      const newEntry = await patientService.addEntry(
        id,
        payload as HealthCheckEntryFormValues,
      );
      setPatient((current) =>
        current
          ? { ...current, entries: current.entries.concat(newEntry) }
          : current,
      );
      setShowEntryForm(false);
      resetEntryForm();
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
            New Entry
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
              select
              label="Entry type"
              value={entryType}
              onChange={({ target }) => setEntryType(target.value as EntryType)}
            >
              <MenuItem value="HealthCheck">HealthCheck</MenuItem>
              <MenuItem value="OccupationalHealthcare">
                OccupationalHealthcare
              </MenuItem>
              <MenuItem value="Hospital">Hospital</MenuItem>
            </TextField>
            <TextField
              label="Date"
              type="date"
              value={entryForm.date}
              onChange={({ target }) => {
                setEntryForm((current) => ({ ...current, date: target.value }));
                setFormError(undefined);
              }}
              slotProps={{ inputLabel: { shrink: true } }}
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
              select
              label="Diagnosis codes"
              value={entryForm.diagnosisCodes}
              slotProps={{
                select: {
                  multiple: true,
                  displayEmpty: true,
                  renderValue: (selected) => {
                    const values = selected as string[];
                    return values.length > 0 ? values.join(", ") : "";
                  },
                },
              }}
              onChange={({ target }) => {
                const nextValue =
                  typeof target.value === "string"
                    ? target.value
                        .split(",")
                        .map((code) => code.trim())
                        .filter(Boolean)
                    : (target.value as string[]);

                setEntryForm((current) => ({
                  ...current,
                  diagnosisCodes: nextValue,
                }));
                setFormError(undefined);
              }}
            >
              {diagnoses.map((diagnosis) => (
                <MenuItem key={diagnosis.code} value={diagnosis.code}>
                  {diagnosis.code}
                </MenuItem>
              ))}
            </TextField>
            {entryType === "HealthCheck" && (
              <TextField
                select
                label="Health check rating"
                value={entryForm.healthCheckRating}
                onChange={({ target }) => {
                  const value = target.value;
                  setEntryForm((current) => ({
                    ...current,
                    healthCheckRating: value,
                  }));

                  const numericValue = Number(value);
                  if (
                    value === "" ||
                    !Number.isInteger(numericValue) ||
                    numericValue < 0 ||
                    numericValue > 3
                  ) {
                    setFormError("healthCheckRating: Invalid input");
                  } else {
                    setFormError(undefined);
                  }
                }}
                required
              >
                <MenuItem value="">Select rating</MenuItem>
                <MenuItem value={0}>0 - Healthy</MenuItem>
                <MenuItem value={1}>1 - Low risk</MenuItem>
                <MenuItem value={2}>2 - High risk</MenuItem>
                <MenuItem value={3}>3 - Critical risk</MenuItem>
              </TextField>
            )}
            {entryType === "OccupationalHealthcare" && (
              <>
                <TextField
                  label="Employer name"
                  value={entryForm.employerName}
                  onChange={({ target }) => {
                    setEntryForm((current) => ({
                      ...current,
                      employerName: target.value,
                    }));
                    setFormError(undefined);
                  }}
                  required
                />
                <TextField
                  label="Sick leave start date"
                  type="date"
                  value={entryForm.sickLeaveStartDate}
                  onChange={({ target }) => {
                    setEntryForm((current) => ({
                      ...current,
                      sickLeaveStartDate: target.value,
                    }));
                    setFormError(undefined);
                  }}
                  slotProps={{ inputLabel: { shrink: true } }}
                />
                <TextField
                  label="Sick leave end date"
                  type="date"
                  value={entryForm.sickLeaveEndDate}
                  onChange={({ target }) => {
                    setEntryForm((current) => ({
                      ...current,
                      sickLeaveEndDate: target.value,
                    }));
                    setFormError(undefined);
                  }}
                  slotProps={{ inputLabel: { shrink: true } }}
                />
              </>
            )}
            {entryType === "Hospital" && (
              <>
                <TextField
                  label="Discharge date"
                  type="date"
                  value={entryForm.dischargeDate}
                  onChange={({ target }) => {
                    setEntryForm((current) => ({
                      ...current,
                      dischargeDate: target.value,
                    }));
                    setFormError(undefined);
                  }}
                  slotProps={{ inputLabel: { shrink: true } }}
                  required
                />
                <TextField
                  label="Discharge criteria"
                  value={entryForm.dischargeCriteria}
                  onChange={({ target }) => {
                    setEntryForm((current) => ({
                      ...current,
                      dischargeCriteria: target.value,
                    }));
                    setFormError(undefined);
                  }}
                  required
                />
              </>
            )}
            <Stack direction="row" spacing={2}>
              <Button type="submit" variant="contained">
                ADD
              </Button>
              <Button
                variant="outlined"
                onClick={() => {
                  setShowEntryForm(false);
                  resetEntryForm();
                }}
              >
                Cancel
              </Button>
            </Stack>
          </Stack>
        </Box>
      )}
    </Box>
  );
};

export default PatientPage;

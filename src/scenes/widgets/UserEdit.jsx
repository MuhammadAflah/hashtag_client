import { TextField, Box, Typography, Grid, useTheme } from "@mui/material";
import { Button } from "@mui/material";
import { EditOutlined } from "@mui/icons-material";
import { useState } from "react";
import WidgetWrapper from "components/WidgetWrapper";
import ChangePasswordWidget from "./ChangePasswordWidge";
import { useDispatch, useSelector } from "react-redux";
import { setIsEditing, setUserData } from "state/authSlice";
import { putDataAPI } from "utils/fetchData";
import { toast, Toaster } from "react-hot-toast";
import { useParams } from "react-router-dom";
import * as yup from "yup"

const UserEdit = ({ user, onSave, onCancel }) => {
  const { palette } = useTheme();
  const dark = palette.neutral.dark;
  const [isPasswordEdit, setIsPasswordEdit] = useState(false);
  const [firstName, setFirstName] = useState(user?.firstName);
  const [lastName, setLastName] = useState(user?.lastName);
  const [email, setEmail] = useState(user?.email);
  const [location, setLocation] = useState(user?.location);
  const [occupation, setOccupation] = useState(user?.occupation);
  const [validationErrors, setValidationErrors] = useState({});
  const dispatch = useDispatch()
  const { userId } = useParams();
  const token = useSelector((state) => state.token);

  const schema = yup.object().shape({
    firstName: yup.string().required('First name is required').matches(/^\S.*$/, "Field must not start with white space"),
    lastName: yup.string().required('Last name is required').matches(/^\S.*$/, "Field must not start with white space"),
    email: yup.string().email('Invalid email').required('Email is required').matches(/^\S.*$/, "Field must not start with white space"),
    location: yup.string().required('location is required').matches(/^\S.*$/, "Field must not start with white space"),
    occupation: yup.string().required('occupation is required').matches(/^\S.*$/, "Field must not start with white space"),
  });


  const handleSave = async () => {
    const isValid = await validateForm();
    if (isValid) {
      onSave({
        ...user,
        firstName,
        lastName,
        email,
        location,
        occupation,
      });
    }
  };

  const onPasswordSave = async (userDetails) => {
    try {
      const { data } = await putDataAPI(`/users/${userId}`, userDetails, token);
      dispatch(setUserData({ user: data }));
      dispatch(setIsEditing({ isEditing: false }));
    } catch (err) {
      toast.error(err.response.data.error, {
        position: "bottom-center",
      });
      console.error(err);
    }
  };

  const handleTextClick = () => {
    setIsPasswordEdit(true);
  };

  const validateForm = async () => {
    try {
      await schema.validate({ firstName, lastName, email, location, occupation }, { abortEarly: false });
      setValidationErrors({});
      return true;
    } catch (err) {
      const errors = err.inner.reduce((acc, curr) => ({ ...acc, [curr.path]: curr.message }), {});
      setValidationErrors(errors);
      return false;
    }
  };


  return isPasswordEdit ? (
    <ChangePasswordWidget
      user={user}
      onCancel={() => dispatch(setIsEditing({ isEditing: false }))}
      onPasswordSave={onPasswordSave}
    />
  ) : (
    <WidgetWrapper>
      <Toaster />
      <Box p="1rem">
        <Typography
          variant="h4"
          color={dark}
          fontWeight="500"
          mb="1rem"
          sx={{ display: "flex", alignItems: "center" }}
        >
          <EditOutlined sx={{ mr: "0.5rem" }} />
          Edit profile
        </Typography>
        <Box
          onClick={handleTextClick}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            mb: "1rem",
            color: palette?.primary?.main,
            "&:hover": {
              cursor: "pointer",
              color: palette?.primary?.light,
            },
          }}
        >
          <Typography>Change Password</Typography>
        </Box>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              error={Boolean(validationErrors.firstName)}
              helperText={validationErrors.firstName}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              error={Boolean(validationErrors.lastName)}
              helperText={validationErrors.lastName}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Email"
              value={email}
              disabled
              onChange={(e) => setEmail(e.target.value)}
              error={Boolean(validationErrors.email)}
              helperText={validationErrors.email}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              error={Boolean(validationErrors.location)}
              helperText={validationErrors.location}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Occupation"
              value={occupation}
              onChange={(e) => setOccupation(e.target.value)}
              error={Boolean(validationErrors.occupation)}
              helperText={validationErrors.occupation}
            />
          </Grid>
        </Grid>

        <Box display="flex" justifyContent="flex-end" mt="1rem">
          <Button variant="contained" color="primary" onClick={onCancel}>
            Cancel
          </Button>
          <Box ml="1rem">
            <Button variant="contained" color="primary" onClick={handleSave}>
              Save
            </Button>
          </Box>
        </Box>
      </Box>
    </WidgetWrapper>
  );
};

export default UserEdit;

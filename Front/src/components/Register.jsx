import { useState } from 'react';
import { register } from '../services/authService';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Stack,
  Box,
  Button,
  Typography,
  Container,
  Paper,
  Alert,
  Collapse,
  Link,
  InputLabel,
  OutlinedInput,
  FormControl,
} from '@mui/material';

function Register() {
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    correo: '',
    telefono: '',
    pass: '',
  });
  const [error, setError] = useState(null);
  const [showError, setShowError] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await register(formData);
      const { token } = response;
      localStorage.setItem('authToken', token);
      navigate('/dashboard');
    } catch (error) {
      setError('Error al registrar');
      setShowError(true);
    }
  };

  return (
    <Container
      maxWidth="sm"
      sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '90vh' }}
    >
      <Paper
        elevation={12}
        sx={{
          padding: 5,
          width: '100%',
          borderRadius: '12px',
          boxShadow: '0 12px 20px 0 rgba(0, 0, 0, 0.2)',
        }}
      >
        <Stack spacing={2}>
          <Typography variant="h4" align="center" sx={{ fontWeight: 600, color: '#333' }}>
            Registrarse
          </Typography>
          <Typography
            color="text.secondary"
            variant="body2"
            align="center"
            sx={{ marginBottom: 3, color: '#666' }}
          >
            ¿Ya tienes cuenta?{' '}
            <Link
              component={RouterLink}
              to="/login"
              underline="hover"
              sx={{ fontWeight: 500, color: '#4caf50' }}
            >
              Inicia sesión
            </Link>
          </Typography>

          <Box
            component="form"
            onSubmit={handleRegister}
            noValidate
            sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}
          >
            <FormControl fullWidth variant="outlined">
              <InputLabel>Nombre</InputLabel>
              <OutlinedInput
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                label="Nombre"
              />
            </FormControl>

            <FormControl fullWidth variant="outlined">
              <InputLabel>Apellido</InputLabel>
              <OutlinedInput
                name="apellido"
                value={formData.apellido}
                onChange={handleChange}
                label="Apellido"
              />
            </FormControl>

            <FormControl fullWidth variant="outlined">
              <InputLabel>Correo</InputLabel>
              <OutlinedInput
                name="correo"
                value={formData.correo}
                onChange={handleChange}
                label="Correo"
                type="email"
              />
            </FormControl>

            <FormControl fullWidth variant="outlined">
              <InputLabel>Teléfono</InputLabel>
              <OutlinedInput
                name="telefono"
                value={formData.telefono}
                onChange={handleChange}
                label="Teléfono"
              />
            </FormControl>

            <FormControl fullWidth variant="outlined">
              <InputLabel>Contraseña</InputLabel>
              <OutlinedInput
                name="pass"
                value={formData.pass}
                onChange={handleChange}
                type="password"
                label="Contraseña"
              />
            </FormControl>

            <Collapse in={showError}>
              <Alert
                severity="error"
                onClose={() => setShowError(false)}
                sx={{ borderRadius: '8px', bgcolor: '#f44336', color: '#fff' }}
              >
                {error}
              </Alert>
            </Collapse>

            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{
                padding: '10px',
                backgroundColor: '#3f51b5',
                color: '#fff',
                borderRadius: '8px',
                boxShadow: '0 4px 14px 0 rgba(0, 0, 0, 0.2)',
                '&:hover': {
                  backgroundColor: '#303f9f',
                },
              }}
            >
              Registrar
            </Button>
          </Box>
        </Stack>
      </Paper>
    </Container>
  );
}

export default Register;

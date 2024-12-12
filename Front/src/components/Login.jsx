import { useState } from 'react';
import { login } from '../services/authService';
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
  FormHelperText,
} from '@mui/material';
import { Eye, EyeSlash } from '@phosphor-icons/react';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [showError, setShowError] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const { token } = await login(email, password);
      if (token) {
        localStorage.setItem('authToken', token);
        navigate('/dashboard');
      } else {
        throw new Error('Token no recibido');
      }
    } catch (error) {
      setError(error.message || 'Error al iniciar sesión. Verifica tus credenciales.');
      setShowError(true);
      console.error('Error al iniciar sesión:', error);
    }
  };

  return (
    <>
      <Container maxWidth="sm" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '90vh' }}>
        <Paper elevation={12} sx={{ padding: 5, width: '100%', borderRadius: '12px', boxShadow: '0 12px 20px 0 rgba(0, 0, 0, 0.2)' }}>
          <Stack spacing={2}>
            <Typography variant="h4" align="center" sx={{ fontWeight: 600, color: '#333' }}>
              Iniciar sesión
            </Typography>
            <Typography color="text.secondary" variant="body2" align="center" sx={{ marginBottom: 3, color: '#666' }}>
              ¿No tienes cuenta?{' '}
              <Link component={RouterLink} to="/register" underline="hover" sx={{ fontWeight: 500, color: '#4caf50' }}>
                Regístrate
              </Link>
            </Typography>

            <Box component="form" onSubmit={handleLogin} noValidate sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <FormControl fullWidth variant="outlined" error={!!error}>
                <InputLabel>Email</InputLabel>
                <OutlinedInput
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  label="Email"
                  type="email"
                  sx={{
                    backgroundColor: '#fff',
                    borderRadius: '8px',
                    '& .MuiOutlinedInput-notchedOutline': { borderColor: '#e0e0e0' },
                    '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#bdbdbd' },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#3f51b5' },
                  }}
                />
                {error && <FormHelperText>{error}</FormHelperText>}
              </FormControl>

              <FormControl fullWidth variant="outlined" error={!!error}>
                <InputLabel>Contraseña</InputLabel>
                <OutlinedInput
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type={showPassword ? 'text' : 'password'}
                  label="Contraseña"
                  sx={{
                    backgroundColor: '#fff',
                    borderRadius: '8px',
                    '& .MuiOutlinedInput-notchedOutline': { borderColor: '#e0e0e0' },
                    '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#bdbdbd' },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#3f51b5' },
                  }}
                  endAdornment={
                    showPassword ? (
                      <Eye cursor="pointer" onClick={() => setShowPassword(false)} />
                    ) : (
                      <EyeSlash cursor="pointer" onClick={() => setShowPassword(true)} />
                    )
                  }
                />
              </FormControl>

              <Collapse in={showError}>
                <Alert severity="error" onClose={() => setShowError(false)} sx={{ borderRadius: '8px', bgcolor: '#f44336', color: '#fff' }}>
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
                Iniciar sesión
              </Button>
            </Box>
          </Stack>
        </Paper>
      </Container>
    </>
  );
}

export default Login;

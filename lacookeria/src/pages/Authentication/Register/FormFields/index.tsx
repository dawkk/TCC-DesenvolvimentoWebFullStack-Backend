/* import { Button, FormHelperText, Grid, IconButton, InputAdornment, InputLabel, OutlinedInput, Stack, Typography } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import axios from '../../../../api/axios';

import * as Yup from 'yup';
import { Formik, Form, useFormik } from 'formik';
import { useState } from 'react';

const celRegex = /([0-9]{2,3})?(\([0-9]{2}\))([0-9]{4,5})([0-9]{4})/;

const FormFields = () => {
  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const yupValidationSchema = Yup.object().shape({
    firstName: Yup.string().max(255).required('Nome Obrigatório'),
    lastName: Yup.string().max(255).required('Sobrenome Obrigatório'),
    cellphone: Yup.string().matches(celRegex, 'Este numero não é valido, o formato deveria ser (XX)XXXXXXXXX').required('Celular Obrigatório'),
    email: Yup.string().email('Must be a valid email').max(255).required('Email Obrigatório'),
    password: Yup.string().max(255).required('Senha Obrigatória'),
    addressStreet: Yup.string().max(255),
    addressNumber: Yup.number(),
    addressNeighborhood: Yup.string().max(255),
    addressCity: Yup.string().max(255),
    addressState: Yup.string().max(255),
    addressZipcode: Yup.number(),
    addressExtra: Yup.string().max(255),
  });

  const formik = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
      cellphone: '',
      email: '',
      password: '',
      addressStreet: '',
      addressNumber: '',
      addressNeighborhood: '',
      addressCity: '',
      addressState: '',
      addressZipcode: '',
      addressExtra: '',
      submit: null
    },
    validationSchema: yupValidationSchema,
    onSubmit: (values) => {
      alert(JSON.stringify(values, null, 2));
    },
  });


  const handleSubmit = async (e: any) => {
    e.preventDefault();
  }



  return (
    <>
      <div>
        <form onSubmit={formik.handleSubmit}>
          <Grid
            container spacing={2} sx={{
              display: 'flex', flexWrap: 'wrap', pl: 2, pt: 4, boxSizing: 'border-box',
              '& .MuiTextField-root': { mb: 1 },
            }}>
            <Grid item xs={12} md={6}>
              <Stack spacing={1}>
                <InputLabel>Nome*</InputLabel>
                <OutlinedInput
                  id='firstName'
                  type='firstName'
                  value={formik.values.firstName}
                  name='firstName'
                  placeholder='Nome'
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  error={Boolean(formik.touched.firstName && formik.errors.firstName)}
                />
                {formik.touched.firstName && formik.errors.firstName && (
                  <FormHelperText error id="helper-text-firstname-signup">
                    {formik.errors.firstName}
                  </FormHelperText>
                )}
              </Stack>
            </Grid>

            <Grid item xs={12} md={6}>
              <Stack spacing={1}>
                <InputLabel>Ultimo Sobrenome*</InputLabel>
                <OutlinedInput
                  id='lastName'
                  type='lastName'
                  value={formik.values.lastName}
                  name='lastName'
                  placeholder='Sobrenome'
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  error={Boolean(formik.touched.lastName && formik.errors.lastName)}
                />
                {formik.touched.lastName && formik.errors.lastName && (
                  <FormHelperText error id="helper-text-lastname-signup">
                    {formik.errors.lastName}
                  </FormHelperText>
                )}
              </Stack>
            </Grid>

            <Grid item xs={12} md={6}>
              <Stack spacing={1}>
                <InputLabel>Celular*</InputLabel>
                <OutlinedInput
                  id='cellphone'
                  type='cellphone'
                  value={formik.values.cellphone}
                  name='cellphone'
                  placeholder='Celular'
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  error={Boolean(formik.touched.cellphone && formik.errors.cellphone)}
                />
                {formik.touched.cellphone && formik.errors.cellphone && (
                  <FormHelperText error id="helper-text-cellphone-signup">
                    {formik.errors.cellphone}
                  </FormHelperText>
                )}
              </Stack>
            </Grid>

            <Grid item xs={12} md={12} sx={{ display: 'flex', justifyContent: 'center', mt: 2, mb: 1 }}>
              <Typography variant='h5'>Endereço</Typography>
            </Grid>

            <Grid item xs={12} md={12}>
              <Stack spacing={1}>
                <InputLabel>Rua</InputLabel>
                <OutlinedInput
                  id='addressStreet'
                  type='addressStreet'
                  value={formik.values.addressStreet}
                  name='addressStreet'
                  placeholder='Rua Alameda Avenida'
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  error={Boolean(formik.touched.addressStreet && formik.errors.addressStreet)}
                />
                {formik.touched.addressStreet && formik.errors.addressStreet && (
                  <FormHelperText error id="helper-text-addressStreet-signup">
                    {formik.errors.addressStreet}
                  </FormHelperText>
                )}
              </Stack>
            </Grid>

            <Grid item xs={12} md={6}>
              <Stack spacing={1}>
                <InputLabel>Numero</InputLabel>
                <OutlinedInput
                  id='addressNumber'
                  type='addressNumber'
                  value={formik.values.addressNumber}
                  name='addressNumber'
                  placeholder='523'
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  error={Boolean(formik.touched.addressNumber && formik.errors.addressNumber)}
                />
                {formik.touched.addressNumber && formik.errors.addressNumber && (
                  <FormHelperText error id="helper-text-addressNumber-signup">
                    {formik.errors.addressNumber}
                  </FormHelperText>
                )}
              </Stack>
            </Grid>

            <Grid item xs={12} md={6}>
              <Stack spacing={1}>
                <InputLabel>Bairro</InputLabel>
                <OutlinedInput
                  id='addressNeighborhood'
                  type='addressNeighborhood'
                  value={formik.values.addressNeighborhood}
                  name='addressNeighborhood'
                  placeholder='Centro'
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  error={Boolean(formik.touched.addressNeighborhood && formik.errors.addressNeighborhood)}
                />
                {formik.touched.addressNeighborhood && formik.errors.addressNeighborhood && (
                  <FormHelperText error id="helper-text-addressNeighborhood-signup">
                    {formik.errors.addressNeighborhood}
                  </FormHelperText>
                )}
              </Stack>
            </Grid>

            <Grid item xs={12} md={6}>
              <Stack spacing={1}>
                <InputLabel>Cidade</InputLabel>
                <OutlinedInput
                  id='addressCity'
                  type='addressCity'
                  value={formik.values.addressCity}
                  name='addressCity'
                  placeholder='Campinas'
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  error={Boolean(formik.touched.addressCity && formik.errors.addressCity)}
                />
                {formik.touched.addressCity && formik.errors.addressCity && (
                  <FormHelperText error id="helper-text-addressCity-signup">
                    {formik.errors.addressCity}
                  </FormHelperText>
                )}
              </Stack>
            </Grid>

            <Grid item xs={12} md={6}>
              <Stack spacing={1}>
                <InputLabel>Estado</InputLabel>
                <OutlinedInput
                  id='addressState'
                  type='addressState'
                  value={formik.values.addressState}
                  name='addressState'
                  placeholder='São Paulo'
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  error={Boolean(formik.touched.addressState && formik.errors.addressState)}
                />
                {formik.touched.addressState && formik.errors.addressState && (
                  <FormHelperText error id="helper-text-addressState-signup">
                    {formik.errors.addressState}
                  </FormHelperText>
                )}
              </Stack>
            </Grid>

            <Grid item xs={12} md={6}>
              <Stack spacing={1}>
                <InputLabel>CEP</InputLabel>
                <OutlinedInput
                  id='addressZipcode'
                  type='addressZipcode'
                  value={formik.values.addressZipcode}
                  name='addressZipcode'
                  placeholder='13820-000'
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  error={Boolean(formik.touched.addressZipcode && formik.errors.addressZipcode)}
                />
                {formik.touched.addressZipcode && formik.errors.addressZipcode && (
                  <FormHelperText error id="helper-text-addressZipcode-signup">
                    {formik.errors.addressZipcode}
                  </FormHelperText>
                )}
              </Stack>
            </Grid>

            <Grid item xs={12} md={6}>
              <Stack spacing={1}>
                <InputLabel>Complemento</InputLabel>
                <OutlinedInput
                  id='addressExtra'
                  type='addressExtra'
                  value={formik.values.addressExtra}
                  name='addressExtra'
                  placeholder='Apartamento 15'
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  error={Boolean(formik.touched.addressExtra && formik.errors.addressExtra)}
                />
                {formik.touched.addressExtra && formik.errors.addressExtra && (
                  <FormHelperText error id="helper-text-addressExtra-signup">
                    {formik.errors.addressExtra}
                  </FormHelperText>
                )}
              </Stack>
            </Grid>

            <Grid item xs={12} md={12} sx={{ display: 'flex', justifyContent: 'center', mt: 5, mb: 5 }}>
              <Typography variant='h5'>Credenciais de Login</Typography>
            </Grid>

            <Grid item xs={12} md={12}>
              <Stack spacing={1}>
                <InputLabel>E-mail*</InputLabel>
                <OutlinedInput
                  id='email'
                  type='email'
                  value={formik.values.email}
                  name='email'
                  placeholder='email@email.com'
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  error={Boolean(formik.touched.email && formik.errors.email)}
                />
                {formik.touched.email && formik.errors.email && (
                  <FormHelperText error id="helper-text-email-signup">
                    {formik.errors.email}
                  </FormHelperText>
                )}
              </Stack>
            </Grid>

            <Grid item xs={12} md={12}>
              <Stack spacing={1}>
                <InputLabel>Senha*</InputLabel>
                <OutlinedInput
                  id='password'
                  type={showPassword ? 'text' : 'password'}
                  value={formik.values.password}
                  name='password'
                  placeholder='******'
                  onBlur={formik.handleBlur}
                  onChange={(e) => {
                    formik.handleChange(e);
                  }}
                  inputProps={{}}
                  error={Boolean(formik.touched.password && formik.errors.password)}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        edge="end"
                        size="large"
                      >
                        {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                      </IconButton>
                    </InputAdornment>
                  }
                />
                {formik.touched.password && formik.errors.password && (
                  <FormHelperText error id="helper-text-password-signup">
                    {formik.errors.password}
                  </FormHelperText>
                )}
              </Stack>
            </Grid>
            {formik.errors.submit && (
              <Grid item xs={12}>
                <FormHelperText error>{formik.errors.submit}</FormHelperText>
              </Grid>
            )}
            <Grid item xs={12}>
              <Button
                disableElevation
                fullWidth
                size="large"
                type="submit"
                variant="contained"
                color="primary"
              >
                Criar Conta
              </Button>
            </Grid>
          </Grid>
        </form>
      </div>
    </>
  )
}

export default FormFields; */








import { Button, FormHelperText, Grid, IconButton, InputAdornment, InputLabel, OutlinedInput, Stack, Typography } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import axios from '../../../../api/axios';

import * as Yup from 'yup';
import { Formik, Form } from 'formik';
import { useState } from 'react';

const celRegex = /([0-9]{2,3})?(\([0-9]{2}\))([0-9]{4,5})([0-9]{4})/;

const FormFields = () => {
  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  

  const yupValidationSchema = Yup.object().shape({
    firstName: Yup.string().max(255).required('Nome Obrigatório'),
    lastName: Yup.string().max(255).required('Sobrenome Obrigatório'),
    cellphone: Yup.string().matches(celRegex, 'Este numero não é valido, o formato deveria ser (XX)XXXXXXXXX').required('Celular Obrigatório'),
    email: Yup.string().email('Must be a valid email').max(255).required('Email Obrigatório'),
    password: Yup.string().max(255).required('Senha Obrigatória'),
    addressStreet: Yup.string().max(255),
    addressNumber: Yup.number(),
    addressNeighborhood: Yup.string().max(255),
    addressCity: Yup.string().max(255),
    addressState: Yup.string().max(255),
    addressZipcode: Yup.number(),
    addressExtra: Yup.string().max(255),
  });

  

  return (
    <>
      <Formik
        initialValues={{
          firstName: '',
          lastName: '',
          cellphone: '',
          email: '',
          password: '',
          addressStreet: '',
          addressNumber: '',
          addressNeighborhood: '',
          addressCity: '',
          addressState: '',
          addressZipcode: '',
          addressExtra: '',
          submit: null
        }}
        validationSchema={yupValidationSchema}
        onSubmit={async (values , { setErrors, setStatus, setSubmitting }) => {
          alert(JSON.stringify(values, null, 2));
          try {
            setStatus({ success: false });
            setSubmitting(false);
            
            const response = await axios.post("/users", JSON.stringify({values}), {
              headers: { 'Content-Type': 'application/json'},
              /* withCredentials:true }*/
            });
            console.log(response?.data);
          } catch (err) {
            console.error(err);
            setStatus({ success: false });
            setSubmitting(false);
          }
        }}

      >
        {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
          <Form noValidate onSubmit={handleSubmit}>
            <Grid
              container spacing={2} sx={{
                display: 'flex', flexWrap: 'wrap', pl: 2, pt: 4, boxSizing: 'border-box',
                '& .MuiTextField-root': { mb: 1 },
              }}>

              <Grid item xs={12} md={6}>
                <Stack spacing={1}>
                  <InputLabel>Nome*</InputLabel>
                  <OutlinedInput
                    id='firstName'
                    type='firstName'
                    value={values.firstName}
                    name='firstName'
                    placeholder='Nome'
                    onBlur={handleBlur}
                    onChange={handleChange}
                    error={Boolean(touched.firstName && errors.firstName)}
                  />
                  {touched.firstName && errors.firstName && (
                    <FormHelperText error id="helper-text-firstname-signup">
                      {errors.firstName}
                    </FormHelperText>
                  )}
                </Stack>
              </Grid>

              <Grid item xs={12} md={6}>
                <Stack spacing={1}>
                  <InputLabel>Ultimo Sobrenome*</InputLabel>
                  <OutlinedInput
                    id='lastName'
                    type='lastName'
                    value={values.lastName}
                    name='lastName'
                    placeholder='Sobrenome'
                    onBlur={handleBlur}
                    onChange={handleChange}
                    error={Boolean(touched.lastName && errors.lastName)}
                  />
                  {touched.lastName && errors.lastName && (
                    <FormHelperText error id="helper-text-lastname-signup">
                      {errors.lastName}
                    </FormHelperText>
                  )}
                </Stack>
              </Grid>

              <Grid item xs={12} md={6}>
                <Stack spacing={1}>
                  <InputLabel>Celular*</InputLabel>
                  <OutlinedInput
                    id='cellphone'
                    type='cellphone'
                    value={values.cellphone}
                    name='cellphone'
                    placeholder='Celular'
                    onBlur={handleBlur}
                    onChange={handleChange}
                    error={Boolean(touched.cellphone && errors.cellphone)}
                  />
                  {touched.cellphone && errors.cellphone && (
                    <FormHelperText error id="helper-text-cellphone-signup">
                      {errors.cellphone}
                    </FormHelperText>
                  )}
                </Stack>
              </Grid>

              <Grid item xs={12} md={12} sx={{ display: 'flex', justifyContent: 'center', mt: 2, mb: 1 }}>
                <Typography variant='h5'>Endereço</Typography>
              </Grid>

              <Grid item xs={12} md={12}>
                <Stack spacing={1}>
                  <InputLabel>Rua</InputLabel>
                  <OutlinedInput
                    id='addressStreet'
                    type='addressStreet'
                    value={values.addressStreet}
                    name='addressStreet'
                    placeholder='Rua Alameda Avenida'
                    onBlur={handleBlur}
                    onChange={handleChange}
                    error={Boolean(touched.addressStreet && errors.addressStreet)}
                  />
                  {touched.addressStreet && errors.addressStreet && (
                    <FormHelperText error id="helper-text-addressStreet-signup">
                      {errors.addressStreet}
                    </FormHelperText>
                  )}
                </Stack>
              </Grid>

              <Grid item xs={12} md={6}>
                <Stack spacing={1}>
                  <InputLabel>Numero</InputLabel>
                  <OutlinedInput
                    id='addressNumber'
                    type='addressNumber'
                    value={values.addressNumber}
                    name='addressNumber'
                    placeholder='523'
                    onBlur={handleBlur}
                    onChange={handleChange}
                    error={Boolean(touched.addressNumber && errors.addressNumber)}
                  />
                  {touched.addressNumber && errors.addressNumber && (
                    <FormHelperText error id="helper-text-addressNumber-signup">
                      {errors.addressNumber}
                    </FormHelperText>
                  )}
                </Stack>
              </Grid>

              <Grid item xs={12} md={6}>
                <Stack spacing={1}>
                  <InputLabel>Bairro</InputLabel>
                  <OutlinedInput
                    id='addressNeighborhood'
                    type='addressNeighborhood'
                    value={values.addressNeighborhood}
                    name='addressNeighborhood'
                    placeholder='Centro'
                    onBlur={handleBlur}
                    onChange={handleChange}
                    error={Boolean(touched.addressNeighborhood && errors.addressNeighborhood)}
                  />
                  {touched.addressNeighborhood && errors.addressNeighborhood && (
                    <FormHelperText error id="helper-text-addressNeighborhood-signup">
                      {errors.addressNeighborhood}
                    </FormHelperText>
                  )}
                </Stack>
              </Grid>

              <Grid item xs={12} md={6}>
                <Stack spacing={1}>
                  <InputLabel>Cidade</InputLabel>
                  <OutlinedInput
                    id='addressCity'
                    type='addressCity'
                    value={values.addressCity}
                    name='addressCity'
                    placeholder='Campinas'
                    onBlur={handleBlur}
                    onChange={handleChange}
                    error={Boolean(touched.addressCity && errors.addressCity)}
                  />
                  {touched.addressCity && errors.addressCity && (
                    <FormHelperText error id="helper-text-addressCity-signup">
                      {errors.addressCity}
                    </FormHelperText>
                  )}
                </Stack>
              </Grid>

              <Grid item xs={12} md={6}>
                <Stack spacing={1}>
                  <InputLabel>Estado</InputLabel>
                  <OutlinedInput
                    id='addressState'
                    type='addressState'
                    value={values.addressState}
                    name='addressState'
                    placeholder='São Paulo'
                    onBlur={handleBlur}
                    onChange={handleChange}
                    error={Boolean(touched.addressState && errors.addressState)}
                  />
                  {touched.addressState && errors.addressState && (
                    <FormHelperText error id="helper-text-addressState-signup">
                      {errors.addressState}
                    </FormHelperText>
                  )}
                </Stack>
              </Grid>

              <Grid item xs={12} md={6}>
                <Stack spacing={1}>
                  <InputLabel>CEP</InputLabel>
                  <OutlinedInput
                    id='addressZipcode'
                    type='addressZipcode'
                    value={values.addressZipcode}
                    name='addressZipcode'
                    placeholder='13820-000'
                    onBlur={handleBlur}
                    onChange={handleChange}
                    error={Boolean(touched.addressZipcode && errors.addressZipcode)}
                  />
                  {touched.addressZipcode && errors.addressZipcode && (
                    <FormHelperText error id="helper-text-addressZipcode-signup">
                      {errors.addressZipcode}
                    </FormHelperText>
                  )}
                </Stack>
              </Grid>

              <Grid item xs={12} md={6}>
                <Stack spacing={1}>
                  <InputLabel>Complemento</InputLabel>
                  <OutlinedInput
                    id='addressExtra'
                    type='addressExtra'
                    value={values.addressExtra}
                    name='addressExtra'
                    placeholder='Apartamento 15'
                    onBlur={handleBlur}
                    onChange={handleChange}
                    error={Boolean(touched.addressExtra && errors.addressExtra)}
                  />
                  {touched.addressExtra && errors.addressExtra && (
                    <FormHelperText error id="helper-text-addressExtra-signup">
                      {errors.addressExtra}
                    </FormHelperText>
                  )}
                </Stack>
              </Grid>

              <Grid item xs={12} md={12} sx={{ display: 'flex', justifyContent: 'center', mt: 5, mb: 5 }}>
                <Typography variant='h5'>Credenciais de Login</Typography>
              </Grid>

              <Grid item xs={12} md={12}>
                <Stack spacing={1}>
                  <InputLabel>E-mail*</InputLabel>
                  <OutlinedInput
                    id='email'
                    type='email'
                    value={values.email}
                    name='email'
                    placeholder='email@email.com'
                    onBlur={handleBlur}
                    onChange={handleChange}
                    error={Boolean(touched.email && errors.email)}
                  />
                  {touched.email && errors.email && (
                    <FormHelperText error id="helper-text-email-signup">
                      {errors.email}
                    </FormHelperText>
                  )}
                </Stack>
              </Grid>

              <Grid item xs={12} md={12}>
                <Stack spacing={1}>
                  <InputLabel>Senha*</InputLabel>
                  <OutlinedInput
                    id='password'
                    type={showPassword ? 'text' : 'password'}
                    value={values.password}
                    name='password'
                    placeholder='******'
                    onBlur={handleBlur}
                    onChange={(e) => {
                      handleChange(e);
                    }}
                    inputProps={{}}
                    error={Boolean(touched.password && errors.password)}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          edge="end"
                          size="large"
                        >
                          {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                        </IconButton>
                      </InputAdornment>
                    }
                  />
                  {touched.password && errors.password && (
                    <FormHelperText error id="helper-text-password-signup">
                      {errors.password}
                    </FormHelperText>
                  )}
                </Stack>
              </Grid>
              {errors.submit && (
                <Grid item xs={12}>
                  <FormHelperText error>{errors.submit}</FormHelperText>
                </Grid>
              )}
              <Grid item xs={12}>
                  <Button
                    disableElevation
                    disabled={isSubmitting}
                    fullWidth
                    size="large"
                    type="submit"
                    variant="contained"
                    color="primary"
                  >
                    Criar Conta
                  </Button>
              </Grid>
            </Grid>
          </Form>
        )}
      </Formik>
    </>
  )
}

export default FormFields;
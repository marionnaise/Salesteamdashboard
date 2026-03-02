import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useActionState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppHeader from './AppHeader';


const Signup = () => {
  const { signUpNewUser } = useAuth();
  const navigate = useNavigate();

  const [error, submitAction, isPending] = useActionState(
    async (previousState, formData) => {
      const email = formData.get('email');
      const password = formData.get('password');
      const name = formData.get('name');
      const accountType = formData.get('account-type');

      const {
        success,
        data,
        error: signUpError,
      } = await signUpNewUser(email, password, name, accountType);

      if (signUpError) {
        return new Error(signUpError);
      }
      if (success && data?.session) {
        navigate('/dashboard');
        return null;
      }
      return null;
    },
    null
  );

  return (
    <>
      <AppHeader/>
      <div className="sign-form-container">
        <form
          action={submitAction}
          aria-label="Sign up form"
          aria-describedby="form-description"
        >
          <div id="form-description" className="sr-only">
            Use this form to create a new account. Enter your email and
            password.
          </div>

          <h2 className="form-title">Inscription</h2>
          <p>
            Déjà un compte ?{' '}
            <Link className="form-link" to="/">
              Se connecter
            </Link>
          </p>

          <label htmlFor="name">Prénom</label>
          <input
            className="form-input"
            type="text"
            name="name"
            id="name"
            placeholder=""
            required
            aria-required="true"
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={error ? 'signup-error' : undefined}
            disabled={isPending}
          />

          <label htmlFor="email">Email</label>
          <input
            className="form-input"
            type="email"
            name="email"
            id="email"
            placeholder=""
            required
            aria-required="true"
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={error ? 'signup-error' : undefined}
            disabled={isPending}
          />

          <label htmlFor="password">Mot de passe</label>
          <input
            className="form-input"
            type="password"
            name="password"
            id="password"
            placeholder=""
            required
            aria-required="true"
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={error ? 'signup-error' : undefined}
            disabled={isPending}
          />

          <fieldset
            className="form-fieldset"
            aria-required="true"
            aria-label="Select your role"
          >
            <legend>Séectionner un rôle</legend>
            <div className="radio-group">
              <label>
                <input
                  type="radio"
                  name="account-type"
                  value="admin"
                  required
                />{' '}
                Admin
              </label>
              <label>
                <input type="radio" name="account-type" value="rep" required />{' '}
                Délégué commercial
              </label>
            </div>
          </fieldset>

          <button
            type="submit"
            className="form-button"
            disabled={isPending}
            aria-busy={isPending}
          >
            {isPending ? 'Inscription...' : "S'inscrire"}
          </button>

          {error && (
            <div id="signup-error" role="alert" className="sign-form-error-message">
              {error.message}
            </div>
          )}
        </form>
      </div>
    </>
  );
};

export default Signup;

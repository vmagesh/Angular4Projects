import { Credentials } from './credentials.service';

export class MockCredentialsService {
  credentials: Credentials | null = {
    user_id: 'test',
    app_key: '123',
    code: '1',
    phno: '1',
    jwt_token: '1'
  };

  isAuthenticated(): boolean {
    return !!this.credentials;
  }

  setCredentials(credentials?: Credentials, _remember?: boolean) {
    this.credentials = credentials || null;
  }
}

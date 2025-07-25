import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import {
  MsalProvider,
  AuthenticatedTemplate,
  UnauthenticatedTemplate,
  useMsal,
  useIsAuthenticated,
} from '@azure/msal-react';

function LandingPage() {
  const { instance } = useMsal();

  const handleLogin = () => {
    instance
      .loginPopup({
        scopes: ['User.Read'],
      })
      .catch((e) => {
        console.error(e);
      });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 p-4">
      <div className="w-full max-w-4xl mx-auto">
        <Card className="shadow-lg">
          <div className="grid grid-cols-1 md:grid-cols-2">
            {/* Left side: Information */}
            <div className="p-8 space-y-6 bg-muted/30">
              <div className="flex items-center space-x-4">
                <svg
                  width="48"
                  height="48"
                  viewBox="0 0 48 48"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M24 4C12.96 4 4 12.96 4 24C4 35.04 12.96 44 24 44C35.04 44 44 35.04 44 24C44 12.96 35.04 4 24 4ZM24 36C17.38 36 12 30.62 12 24S17.38 12 24 12C30.62 12 36 17.38 36 24S30.62 36 24 36Z"
                    fill="#0D47A1"
                  />
                  <path
                    d="M24 18V26M24 30H24.02V30.02H24V30Z"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
                  FSS Virtual Assistant
                </h1>
              </div>
              <p className="text-gray-600 dark:text-gray-400">
                Empowering the Financial Supervision Sector of the Bangko
                Sentral ng Pilipinas with AI-driven insights and operational
                efficiency.
              </p>
              <ul className="space-y-4 text-sm text-gray-700 dark:text-gray-300">
                <li className="flex items-start">
                  <span className="mr-2 mt-1">✓</span>
                  <span>
                    <strong>Regulatory Search:</strong> Instantly retrieve and
                    summarize BSP circulars and memoranda.
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 mt-1">✓</span>
                  <span>
                    <strong>Speechwriting Support:</strong> Draft context-aware
                    speeches and briefing notes.
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 mt-1">✓</span>
                  <span>
                    <strong>Internal Knowledge Assistant:</strong> Get guided
                    access to internal guidelines and legal opinions.
                  </span>
                </li>
              </ul>
            </div>
            {/* Right side: Login */}
            <div className="p-8 flex flex-col items-center justify-center">
              <div className="text-center space-y-4">
                <h2 className="text-xl font-semibold">Welcome</h2>
                <p className="text-muted-foreground">
                  Please log in with your Microsoft account to continue.
                </p>
                <Button onClick={handleLogin} className="w-full">
                  <svg
                    className="w-4 h-4 mr-2"
                    viewBox="0 0 21 21"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg">
                    <rect x="1" y="1" width="9" height="9" fill="#f25022" />
                    <rect x="1" y="11" width="9" height="9" fill="#00a4ef" />
                    <rect x="11" y="1" width="9" height="9" fill="#7fba00" />
                    <rect x="11" y="11" width="9" height="9" fill="#ffb900" />
                  </svg>
                  Login with Microsoft
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

export default LandingPage;

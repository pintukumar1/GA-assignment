import { useHistory } from "react-router-dom";

export default function Authenticated() {
  const history = useHistory();
  function redirectToHomepage() {
    setTimeout(() => history.push("/"), 2000);
  }

  return (
    <div>
      {redirectToHomepage()}
    </div>
  );
}

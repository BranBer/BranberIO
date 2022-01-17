import { NextPage } from "next";
import { getProviders, signIn } from "next-auth/react";
import { Provider } from "next-auth/providers";
import { GetServerSideProps  } from "next";

const SignIn = ({ providers } :  {providers: Provider[]}) => {
  return (
    <>
      {Object.values(providers).map((provider) => (
        <div key={provider.name} style={{backgroundColor: "blue"}}>
          <button onClick={() => signIn(provider.id)}>
            Sign in with {provider.name}
          </button>
        </div>
      ))}
    </>);
}

// This is the recommended way for Next.js 9.3 or newer
const getServerSideProps : GetServerSideProps = async (context) => {
  const providers = await getProviders()
  return {
    props: { providers },
  }
}

export default SignIn;
export {getServerSideProps};
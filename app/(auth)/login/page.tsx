/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { Container } from "@/components/common/container";
import LoginForm from "@/components/forms/login";

export default function LoginPage(): React.JSX.Element {
    return (
        <Container className="mt-[42px] flex w-full flex-col items-center gap-6 sm:mt-28 sm:max-w-2xl">
            <div className="flex flex-col items-center gap-2 text-center text-white">
                <h3 className="font-sans text-2xl font-bold sm:text-3xl">
                    Login to your account
                </h3>
                <p className="font-sans text-base leading-normal tracking-tight">
                    Connecting African Talent to Global Opportunity
                </p>
            </div>
            <LoginForm />
        </Container>
    );
}

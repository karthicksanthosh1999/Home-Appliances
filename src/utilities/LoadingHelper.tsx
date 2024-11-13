import LottieAnimation from "../Components/Loading/LottieAnimation";
import loadingAnimation from '../../src/assets/animations/Loading.json'
import successAnimation from '../../src/assets/animations/Success.json'
import failureAnimation from '../../src/assets/animations/Failure.json'

type renderAnimationProps = {
    type: "loading" | "success" | "failure"
}

// Lotte Animation Condition
export const renderAnimation = (type: renderAnimationProps['type']) => {
    switch (type) {
        case "loading":
            return <LottieAnimation animationData={loadingAnimation} />
        case "success":
            return <LottieAnimation animationData={successAnimation} />
        case "failure":
            return <LottieAnimation animationData={failureAnimation} />
        default:
            return null
    }
}
// LottieAnimation.js
import { FC } from 'react';
import Lottie from 'lottie-react';

type LottieAnimationProps = {
    animationData: any,
    loop?: boolean,
    autoplay?: boolean
}

const LottieAnimation: FC<LottieAnimationProps> = ({ animationData, loop = true, autoplay = true }) => {
    return (
        <Lottie
            animationData={animationData}
            loop={loop}
            autoplay={autoplay}
            style={{ width: '300px', height: '300px' }}
        />
    );
};

export default LottieAnimation;

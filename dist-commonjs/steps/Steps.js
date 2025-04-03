'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var jsxRuntime = require('react/jsx-runtime');
var UploadFlow = require('./UploadFlow.js');
var react = require('@chakra-ui/react');
var chakraUiSteps = require('chakra-ui-steps');
var cg = require('react-icons/cg');
var useRsi = require('../hooks/useRsi.js');
var React = require('react');
var steps = require('../utils/steps.js');

const CheckIcon = ({ color }) => jsxRuntime.jsx(cg.CgCheck, { size: "36px", color: color });
const Steps = () => {
    const { initialStepState, translations, isNavigationEnabled } = useRsi.useRsi();
    const initialStep = steps.stepTypeToStepIndex(initialStepState?.type);
    const { nextStep, activeStep, setStep } = chakraUiSteps.useSteps({
        initialStep,
    });
    const [state, setState] = React.useState(initialStepState || { type: UploadFlow.StepType.organizationSelect });
    const history = React.useRef([]);
    const onClickStep = (stepIndex) => {
        const type = steps.stepIndexToStepType(stepIndex);
        const historyIdx = history.current.findIndex((v) => v.type === type);
        if (historyIdx === -1)
            return;
        const nextHistory = history.current.slice(0, historyIdx + 1);
        history.current = nextHistory;
        setState(nextHistory[nextHistory.length - 1]);
        setStep(stepIndex);
    };
    const onBack = () => {
        onClickStep(Math.max(activeStep - 1, 0));
    };
    const onNext = (v) => {
        history.current.push(state);
        setState(v);
        v.type !== UploadFlow.StepType.selectSheet && nextStep();
    };
    return (jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [jsxRuntime.jsx(react.ModalHeader, { display: ["none", "none", "block"], children: jsxRuntime.jsx(chakraUiSteps.Steps, { activeStep: activeStep, checkIcon: CheckIcon, onClickStep: isNavigationEnabled ? onClickStep : undefined, responsive: false, children: steps.steps.map((key) => (jsxRuntime.jsx(chakraUiSteps.Step, { label: translations[key].title }, key))) }) }), jsxRuntime.jsx(UploadFlow.UploadFlow, { state: state, onNext: onNext, onBack: isNavigationEnabled ? onBack : undefined })] }));
};

exports.Steps = Steps;

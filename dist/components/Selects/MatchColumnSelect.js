import { jsx } from 'react/jsx-runtime';
import { Select } from 'chakra-react-select';
import { customComponents } from './MenuPortal.js';
import { useStyleConfig } from '@chakra-ui/react';

const MatchColumnSelect = ({ onChange, value, options, placeholder, name }) => {
    const styles = useStyleConfig("MatchColumnsStep");
    return (jsx(Select, { value: value || null, colorScheme: "gray", useBasicStyles: true, onChange: onChange, placeholder: placeholder, options: options, menuPosition: "fixed", components: customComponents, chakraStyles: {
            ...styles.select,
            menu: (provided) => ({
                ...provided,
                width: "auto",
                minWidth: "300px",
                maxWidth: "600px", // Optional: prevent overly wide menus
            }),
            menuList: (provided) => ({
                ...provided,
                maxHeight: "300px",
                overflowY: "auto",
            }),
        }, "aria-label": name }));
};

export { MatchColumnSelect };

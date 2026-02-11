import React from "react";

declare global {
    namespace JSX {
        interface IntrinsicElements {
            "calendar-date": React.DetailedHTMLProps<
                React.HTMLAttributes<HTMLElement>,
                HTMLElement
            >;
            "calendar-month": React.DetailedHTMLProps<
                React.HTMLAttributes<HTMLElement>,
                HTMLElement
            >;
        }
    }
}

export { };

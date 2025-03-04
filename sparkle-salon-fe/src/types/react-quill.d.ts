declare module 'react-quill' {
    import { ComponentType } from 'react';

    interface QuillModules {
        toolbar?: Array<Array<string | object>>;
        clipboard?: {
            matchVisual?: boolean;
        };
        keyboard?: {
            bindings?: Record<string, unknown>;
        };
        history?: {
            delay?: number;
            maxStack?: number;
            userOnly?: boolean;
        };
    }

    interface ReactQuillProps {
        value?: string;
        onChange?: (content: string) => void;
        modules?: QuillModules;
        formats?: string[];
        theme?: string;
        readOnly?: boolean;
        placeholder?: string;
        preserveWhitespace?: boolean;
    }

    const ReactQuill: ComponentType<ReactQuillProps>;
    export default ReactQuill;
} 
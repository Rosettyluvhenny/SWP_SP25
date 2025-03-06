/* eslint-disable @typescript-eslint/no-explicit-any */
import Quill from 'quill';
import { forwardRef,  useEffect,  useLayoutEffect,  useRef } from 'react';
import "quill/dist/quill.snow.css";
const Editor = forwardRef(
  ({ onTextChange, defaultValue }: { onTextChange: (text: string) => void, defaultValue: string |null }, ref: any) => {
    
    const containerRef = useRef(null);
    const defaultValueRef = useRef(defaultValue);
    useEffect(() => {
      defaultValueRef.current = defaultValue;
    }, [defaultValue]);
    const onTextChangeRef = useRef(onTextChange);
    useLayoutEffect(() => {
        onTextChangeRef.current = onTextChange;
      });
    useEffect(() => {
        const toolbarOptions = [
            ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
            ['blockquote', 'code-block'],
            ['link', 'image', 'video', 'formula'],
          
            [{ 'header': 1 }, { 'header': 2 }],               // custom button values
            [{ 'list': 'ordered'}, { 'list': 'bullet' }, { 'list': 'check' }],
            [{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
            [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
            [{ 'direction': 'rtl' }],
            [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
          
            [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
            [{ 'font': [] }],
            [{ 'align': [] }],
          
            ['clean']                                         // remove formatting button
          ];
      const container: any = containerRef.current;
      const editorContainer = container.appendChild(
        container.ownerDocument.createElement('div'),
      );
      const quill = new Quill(editorContainer, {
        theme: 'snow',
        modules: {
          toolbar: toolbarOptions
        }
      });
      ref.current = quill;
      quill.on(Quill.events.TEXT_CHANGE, () => {
        onTextChangeRef.current?.(quill.getSemanticHTML());
      });
      if (defaultValue) {
        const delta = quill.clipboard.convert({html:defaultValue})
        quill.setContents(delta, Quill.sources.SILENT);
      }
      return () => {
        ref.current = null;
        container.innerHTML = '';
      };
    }, [ref, defaultValue]);

    return <div className='h-[400px]' ref={containerRef}></div>;
  },
);

Editor.displayName = 'Editor';

export default Editor;
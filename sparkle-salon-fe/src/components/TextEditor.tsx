/* eslint-disable @typescript-eslint/no-explicit-any */
import Quill from 'quill';
import { forwardRef, useEffect,  useRef } from 'react';
const Editor = forwardRef(
  ({ onTextChange, defaultValue }: { onTextChange: (text: string) => void, defaultValue: any }, ref: any) => {
    
    const containerRef = useRef(null);
    const defaultValueRef = useRef(defaultValue);
    const onTextChangeRef = useRef(onTextChange);
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
      if (defaultValueRef.current) {
        quill.setContents(defaultValueRef.current);
      }
      quill.on(Quill.events.TEXT_CHANGE, () => {
        onTextChangeRef.current?.(quill.getSemanticHTML());
      });

      ref.current = quill;

      return () => {
        ref.current = null;
        container.innerHTML = '';
      };
    }, [onTextChange, ref]);

    return <div className='h-[400px]' ref={containerRef}></div>;
  },
);

Editor.displayName = 'Editor';

export default Editor;
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useRef } from 'react';
import Editor from './TextEditor';
import Quill from 'quill';
import "quill/dist/quill.snow.css";
const Delta = Quill.import('delta');

const QuillTest = ({defaultValue, setServiceDescription}: {defaultValue: string, setServiceDescription: (text: string) => void}) => {

  // Use a ref to access the quill instance directly
  const quillRef = useRef<any>(undefined);
  const defaultValueRef = useRef(defaultValue);
  const onTextChange = (text: string) => {
    setServiceDescription(text);
  }
  if (defaultValueRef.current) {
    quillRef.current.setContents(defaultValueRef.current);
  }
  return (
    <div className='mt-5'>
      <Editor
        ref={quillRef}
        defaultValue={new Delta()}
        onTextChange={onTextChange}
      />
    </div>
  );
};

export default QuillTest;
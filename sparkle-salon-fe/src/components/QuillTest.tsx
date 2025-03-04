/* eslint-disable @typescript-eslint/no-explicit-any */
import { useRef } from 'react';
import Editor from './TextEditor';
import Quill from 'quill';
import "quill/dist/quill.snow.css";
const Delta = Quill.import('delta');

const QuillTest = () => {

  // Use a ref to access the quill instance directly
  const quillRef = useRef<Quill>(undefined);
  const onTextChange = (text: string) => {
    console.log(text);
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
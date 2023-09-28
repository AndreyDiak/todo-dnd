import { Editor } from '@tinymce/tinymce-react';
import { forwardRef } from 'react';

interface Props {
   initialValue: any;
}

const plugins: string[] = [
   'advlist',
   'autolink',
   'lists',
   'link',
   'image',
   'charmap',
   'print',
   'preview',
   'anchor',
   'searchreplace',
   'visualblocks',
   'code',
   'fullscreen',
   'insertdatetime',
   'media',
   'table',
   'paste',
   'code',
   'help',
   'wordcount',
];

const toolbar =
   'undo redo | formatselect | bold italic backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | help';

const apiKey = '9rxiil86jjekf2u3irudd8oxw2vo5p6flzwnxf7jzwapdwd5';

export const DescriptionEditor = forwardRef<any, Props>((props, ref) => {
   return (
      <Editor
         // eslint-disable-next-line @typescript-eslint/ban-ts-comment
         // @ts-ignore
         onInit={(evt, editor) => (ref.current = editor)}
         apiKey={apiKey}
         initialValue={props.initialValue}
         init={{
            height: 300,
            width: '100%',
            menubar: false,
            plugins,
            toolbar,
         }}
      />
   );
});

DescriptionEditor.displayName = 'DescriptionEditor';

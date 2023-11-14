import { useState, useEffect } from 'react'
import './App.less'
import { MantineProvider } from '@mantine/core';
import { Image, Center, FileButton, Button, Box, LoadingOverlay } from '@mantine/core';
import axios from 'axios'

function App() {
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [stylized, setStylized] = useState<ArrayBuffer | string | null>(null);
  useEffect(() => { axios.get((window as any).ENDPOINT + "/api/keep") }, [])
  
  const uploadAndPlay = async (uploaded: File) => {
    const payload = uploaded ?? file;
    setFile(payload);
    setLoading(true);
    const form = new FormData();
    form.append("file", payload);
    const result = await axios.post((window as any).ENDPOINT + "/api/image-stylization", form, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      responseType: 'blob'
    });
    const reader = new window.FileReader();
    reader.readAsDataURL(result.data); 
    reader.onload = function() {
      setStylized(reader.result);
      setLoading(false);
  }
  }
  return (
    <MantineProvider withGlobalStyles withNormalizeCSS>
      <div className="header">
        <div className="title">3D Cartoonization</div>
        <div className="subtitle">powered by Serverless Devs</div>
      </div>
      <div className="uploader">
        <FileButton accept="image/png,image/jpeg" onChange={uploadAndPlay}>
          {(props) => <Button {...props} variant="gradient" gradient={{ from: 'indigo', to: 'cyan' }}>Upload and Play!</Button>}
        </FileButton>
      </div>
      <div className="tips">Upload photo with people / 请上传带有人像的照片</div>
      <Center className="pictures" mt={60} maw={'40vw'} mah={'50%'} mx="auto">
        <Box mah={'40vw'} pos="relative">
          <Image className="original" mah={'40vw'} mx="auto" radius="md" src={ file ? URL.createObjectURL(file) : "./demo.png"} alt="original picture" />
        </Box>
        <Box mah={'40vw'} pos="relative" ml={30}>
          <LoadingOverlay visible={loading} overlayBlur={2} />
          <Image className="stylized" mah={'40vw'} mx="auto" radius="md" src={stylized ? (stylized as string) : "./demo-stylized.png"} alt="stylized picture" />
        </Box>
      </Center>
      <div className="footer">
        <a href="https://serverless-devs.com/" target="_blank">
          <Image className="logo devs-logo" maw={100} src={"./serverlessdevs-logo.png"}/>
        </a>
        <a href="https://modelscope.cn/models/damo/cv_unet_person-image-cartoon-3d_compound-models/summary" target="_blank">
          <Image className="logo model-logo" maw={250} src={"./modelscope-logo.svg"}/>
        </a>
      </div>
      <div className="license">
        <a target="_blank" href="https://www.apache.org/licenses/LICENSE-2.0">Apache License 2.0</a>
      </div>
    </MantineProvider>
  )
}

export default App

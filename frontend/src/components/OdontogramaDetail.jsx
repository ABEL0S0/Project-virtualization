import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Stage, Layer, Image, Line } from 'react-konva';
import useImage from 'use-image';
import { Button } from 'primereact/button';
import { ColorPicker } from 'primereact/colorpicker';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import defaultOdontograma from '../assets/odontograma.png'; // Import the default image

const API_URL = import.meta.env.VITE_API_URL;
const OdontogramaDetail = ({ id }) => {
  const [imageUrl, setImageUrl] = useState(null);
  const [lines, setLines] = useState([]);
  const [color, setColor] = useState('#000000');
  const isDrawing = useRef(false);

  useEffect(() => {
    axios.get(`${API_URL}/odontograma/${id}/imagen`, { responseType: 'blob' })
      .then(response => {
        const url = URL.createObjectURL(response.data);
        setImageUrl(url);
      })
      .catch(error => {
        console.error('Error fetching the image', error);
      });
  }, [id]);

  const handleMouseDown = () => {
    isDrawing.current = true;
    setLines([...lines, { color: color, points: [] }]);
  };

  const handleMouseMove = (e) => {
    if (!isDrawing.current) return;
    const stage = e.target.getStage();
    const point = stage.getPointerPosition();
    let lastLine = lines[lines.length - 1];
    lastLine.points = lastLine.points.concat([point.x, point.y]);
    lines.splice(lines.length - 1, 1, lastLine);
    setLines(lines.concat());
  };

  const handleMouseUp = () => {
    isDrawing.current = false;
  };

  const undoLastLine = () => {
    setLines(lines.slice(0, -1));
  };

  const saveDrawing = async () => {
    const stage = stageRef.current;
    const dataUrl = stage.toDataURL();
    const file = await dataURLToFile(dataUrl, 'drawing.png');
  
    const formData = new FormData();
    formData.append('image', file);
  
    try {
      await axios.put(`${API_URL}/odontograma/${id}/actualizarImg`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      console.log('Image saved successfully');
    } catch (error) {
      console.error('Error saving the image', error);
    }
  };
  
  // Helper function to convert data URL to file
  const dataURLToFile = (dataURL, filename) => {
    const [header, data] = dataURL.split(',');
    const mime = header.match(/:(.*?);/)[1];
    const byteString = atob(data);
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const uintArray = new Uint8Array(arrayBuffer);
  
    for (let i = 0; i < byteString.length; i++) {
      uintArray[i] = byteString.charCodeAt(i);
    }
  
    return new File([arrayBuffer], filename, { type: mime });
  };

  const uploadDefaultImage = async () => {
    try {
      const response = await fetch(defaultOdontograma);
      const blob = await response.blob();
      const file = new File([blob], 'odontograma.png', { type: blob.type });
      
      const formData = new FormData();
      formData.append('image', file);
  
      await axios.post(`${API_URL}/odontograma/${id}/subirImg`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      console.log('Default image uploaded successfully');
    } catch (error) {
      console.error('Error uploading the default image', error);
    }
  };

  const stageRef = useRef();
  const [image] = useImage(imageUrl);

  return (
    <div className="p-card p-4" style={{ maxWidth: '450px', margin: '0 auto' }}>
      <h2>Odontograma</h2>
      <div className="p-field">
        <label htmlFor="colorPicker">Selecciona el color del lápiz: </label>
        <ColorPicker 
          id="colorPicker"
          value={color} 
          onChange={(e) => setColor(`#${e.value}`)} 
          style={{ width: '100%' }}
        />
      </div>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <Stage
          width={418}
          height={157}
          onMouseDown={handleMouseDown}
          onMousemove={handleMouseMove}
          onMouseup={handleMouseUp}
          ref={stageRef}
          style={{ border: '1px solid #ccc' }}
        >
          <Layer>
            {image && <Image image={image} width={418} height={157} />}
            {lines.map((line, i) => (
              <Line
                key={i}
                points={line.points}
                stroke={line.color}
                strokeWidth={5}
                tension={0.5}
                lineCap="round"
                globalCompositeOperation="source-over"
              />
            ))}
          </Layer>
        </Stage>
      </div>
      <div className="p-field" style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
        <Button 
          label="Deshacer Cambio" 
          icon="pi pi-undo" 
          className="p-button-secondary" 
          onClick={undoLastLine} 
        />
        <Button 
          label="Guardar Imagen" 
          icon="pi pi-save" 
          className="p-button-success" 
          onClick={saveDrawing} 
        />
        <Button 
          label="Subir Imagen Predeterminada" 
          icon="pi pi-upload" 
          className="p-button-warning" 
          onClick={uploadDefaultImage} 
        />
      </div>
    </div>
  );
};

export default OdontogramaDetail;
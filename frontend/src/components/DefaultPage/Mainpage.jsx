import Excel from "../ExcelSheet/Excel";
import React, { useState } from "react";
import { useNavigate,useLocation } from 'react-router-dom';
import Papa from "papaparse";
import axios from "axios";
import "./Mainpage.css";
import jsPDF from "jspdf";
import { Button } from "react-bootstrap";
import html2canvas from "html2canvas";
import Codebox from "../Codebox";
import Table from "./Table";

// import MyBarChart from "../../reactGraphs/MyBarChart.jsx";

const language = "python";

export default function MainPage() {

  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState(null);
  const [jsonData, setJsonData] = useState(null);
  const [analysisData, setAnalysisData] = useState(null);
  const [heatmapData, setHeatmapData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [bargraph_sp_miss, setBargraph_sp_miss] = useState(null);
  const [bargraph_nan, setBargraph_nan] = useState(null);
  const [bargraph_binning_cat, setBargraph_binning_cat] = useState(null);
  const [bargraph_class_imbal, setBargraph_class_imbal] = useState(null);
  const bargraph_sp_char = null;
  const bargraph_hum_friendly = null;
  const bargraph_tr_spaces = null;
  const [boxplot, setBoxplot] = useState(null);
  const [click, setClick] = useState(false);
  const [fileChosen, setFileChosen] = useState(false);
  const[suspect_sign_metrics,setsuspect]=useState(false);
  const[suspect_detection_metrics,setsuspectt]=useState(false);
  const[amb_datetime_metrics,setdatetimee]=useState(false);
  const[contractions_metrics,setcontractions]=useState(false);
  const [dummy_value_metrics,setdummy]=useState(0);
  const [dummy_value_metrics2,setdummy2]=useState(0);
  const [intasfloat,setintasfloat]=useState(false);
  const [inputVal,setInputVal]=useState(false)


  const handleFileUpload = (event) => {
    setFileChosen(true);
    if(event.target.files.length==0){
      return
    }
    setSelectedFile(event.target.files[0]);
    Papa.parse(event.target.files[0], {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: true,
      complete: function (result) {
        setJsonData(result.data);
        console.log(result.data);
      },
    });
  };

  const handleInputPage = () => {
    const formData = new FormData();
    formData.append("file", selectedFile);
    navigate("/input_data", { state: { file: selectedFile } });
  };

  const handleUpload = () => {
    setClick(true);
    setIsLoading(true);
    const formData = new FormData();
    formData.append("file", selectedFile);
  
    axios
      .post("http://localhost:5001/upload", formData)  // Update the URL accordingly
      .then((response) => {
        // setAnalysisData(response.data);
        // setHeatmapData(response.data.heatmap);]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]];
        // setBargraph_sp_miss(response.data.bargraph_sp_miss);
        // setBargraph_nan(response.data.bargraph_nan);
        // setBoxplot(response.data.outliers.plot);
        // setBargraph_binning_cat(response.data.binning_cat.plot);
        // setBargraph_class_imbal(response.data.imbalance.plot);

        if (!response.data || !response.data.metrics) {
          // Navigate to a new page if response data is null or doesn't have metrics
          navigate('/error_in_backend'); // Replace '/new-page-url' with the actual URL of the new page
          return; // Stop further execution
        }
        console.log("before navigating to datasmells");
        navigate('/datasmells',{ state: { ok:JSON.stringify(response) } });
console.log("hi");
       

     
        // console.log(response);
       // const { dataframe, metrics } = response.data;
        //console.log(response["data"]);
         console.log(response["data"]);
        // setsuspect(response["data"]["metrics"]["suspect_sign"]);
        // setsuspectt(response["data"]["metrics"]["suspect_detection"]);
        // setdatetimee(response["data"]["metrics"]["amb_d_t"]);
        // setcontractions(response["data"]["metrics"]["conte"]);
        // console.log(response["data"]);
        // // setdummy(response["data"]["metrics"]["outliers"]);
        // // console.log(response["data"]);
        // setdummy(response["data"]["metrics"]["outliers"]);
        // setdummy2(response["data"]["metrics"]["outliers"]);
        // console.log(response["data"]["metrics"]["unnecessary_char"]);

        // // navigate('/charts4',{ state: { ok:response["data"]["metrics"]["empty_strings"] }});
        // console.log(response["data"])
        navigate("/datasmells",{ state: { ok:response["data"] }});
        // console.log("hiiii",response["data"]["metrics"]["suspect_sign"]);

        //  navigate('/charts2',{ state: { ok:response["data"]["metrics"]["unnecessary_char"]  }});
         // navigate("/sus_sign_charts",{ state: { ok:response["data"]["metrics"]["suspect_sign"]["X_values"],ok2:response["data"]["metrics"]["suspect_sign"]["Y_values"]  }});
          // navigate("/datasmells");
          // console.log("hiiii",response["data"]["metrics"]["contracting_datasmell"]);
          //navigate("/suspect_detection_charts",{ state: { ok:response["data"]["metrics"]["suspect_detection"]["X_values"],ok2:response["data"]["metrics"]["suspect_detection"]["Y_values"]  }});
          // navigate("/contracting_charts",{ state: { ok:response["data"]["metrics"]["conte"]["X_values"],ok2:response["data"]["metrics"]["conte"]["Y_values"]  }});
        setIsLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setIsLoading(false);
      });
  };
  const handleUpload_refactor = () => {

    setClick(true);
    setIsLoading(true);
    const formData = new FormData();
    formData.append("file", selectedFile);
  
    axios
      .post("http://localhost:5001/refactor", formData)
      .then((response) => {
        if (!response.data || !response.data.refactored_csv) {
          navigate('/error_in_backend');
          return;
        }
        console.log(response.data);
        // Create a Blob object from the refactored CSV data
        const blob = new Blob([response.data.refactored_csv], { type: 'text/csv' });
  
        // Create a temporary anchor element to trigger the download
        const a = document.createElement('a');
        a.href = window.URL.createObjectURL(blob);
        a.download = 'refactored_data.csv'; // Specify the filename
        a.style.display = 'none';
  
        // Append the anchor element to the body and trigger the download
        document.body.appendChild(a);
        a.click();
  
        // Cleanup: Remove the temporary anchor element
        document.body.removeChild(a);
  
        setIsLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setIsLoading(false);
      });
  };

  const handleDownload = () => {
    html2canvas(document.body).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF();
      pdf.addImage(imgData, "PNG", 0, 0);
      pdf.save("page-content.pdf");
    });
  };

  return (
    <div className="App">
<div className="inside"> 
      {isLoading && (
        <div className="loading-overlay">
          <div className="spinner"></div>
        </div>
      )}

      <div className="heading-text">
        <h1>SmellSweep-DataSmell Detector</h1>
      </div>
      <div className="Intput-and-Btn">
        <br />
        <input
          type="file"
          name="file"
          accept=".csv"
          onChange={handleFileUpload}
          className="input-file"
        />
        <Button
          className="analyze-btn d-flex align-self-center"
          variant="success"
          size="lg"
          onClick={handleUpload}
        >
 
          Analysis
          
          
      {suspect_sign_metrics && (
        <div className="suspect-sign-metrics-container">
          {/* Display your dummy value metrics here */}
          <pre>{JSON.stringify(suspect_sign_metrics, null, 2)}</pre>
        </div>
      )}
       {amb_datetime_metrics && (
        <div className="amb-datetime_metrics-container">
          {/* Display your dummy value metrics here */}
          <pre>{JSON.stringify(amb_datetime_metrics, null, 2)}</pre>
        </div>
      )}
      {suspect_detection_metrics && (
        <div className="suspect-detection-metrics-container">
          {/* Display your dummy value metrics here */}
          <pre>{JSON.stringify(suspect_detection_metrics, null, 2)}</pre>
        </div>
      )}
      {contractions_metrics && (
        <div className="contraction-metrics-container">
          {/* Display your dummy value metrics here */}
          <pre>{JSON.stringify(contractions_metrics, null, 2)}</pre>
        </div>
      )}



        </Button>
       
        <Button
          className="analyze-btn d-flex align-self-center"
          variant="success"
          size="lg"
          onClick={handleInputPage}
        >
 
         Customized Refactoring
          
    


        </Button>
        

      </div>
      {fileChosen && jsonData && <Excel myjson={jsonData} />}
      {analysisData && (
        <div className="analysis-container">
          {/* Rest of your code */}
         
        </div>
      )}

</div>

    </div>
  );
}


function splitIntoSentences(text) {
  const sentences = text.split("\n");
  return sentences.filter((sentence) => sentence.length > 0);
}
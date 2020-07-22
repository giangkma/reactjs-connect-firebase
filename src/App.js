import React, { PureComponent } from "react";
import { storage } from "./fireBaseConnect";
import Swal from "sweetalert2";
import "./App.css";
export default class App extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            image: null,
            url: null,
            progress: 0,
        };
    }

    selectFile = (e) => {
        if (e.target.files[0]) {
            this.setState({ image: e.target.files[0] });
        }
    };

    uploadFile = () => {
        const { image } = this.state;
        if (!image) {
            Swal.fire("Hãy chọn file ảnh !", "", "error");
        } else {
            const upload = storage.ref(`image/${image.name}`).put(image);
            upload.on(
                "state_changed",
                (snapshot) => {
                    //progress
                    const progress = Math.round(
                        (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                    );
                    this.setState({ progress });
                },
                (error) => {
                    console.log(error);
                },
                () => {
                    //complete
                    storage
                        .ref(`image`)
                        .child(image.name)
                        .getDownloadURL()
                        .then((url) => {
                            this.setState({ url });
                            Swal.fire(
                                "Tải ảnh lên thành công !",
                                "",
                                "success"
                            );
                        });
                }
            );
        }
    };

    render() {
        const { url, progress } = this.state;
        return (
            <div className="container">
                <div className="form">
                    <div>
                        <input
                            className="input-file"
                            type="file"
                            onChange={this.selectFile}
                        />
                    </div>
                    <button
                        className="button-upload"
                        type="button"
                        onClick={this.uploadFile}
                    >
                        Upload File
                    </button>
                    <div>
                        {progress === 0 || progress === 100 ? (
                            ""
                        ) : (
                            <progress
                                className="progress"
                                value={progress}
                                max="100"
                            />
                        )}
                    </div>
                    <img
                        className="img"
                        src={
                            url ||
                            "https://www.peterpipposkarate.com/wp-content/uploads/2017/04/default-image-768x576.jpg"
                        }
                        alt="img"
                    />
                    <div>
                        <object
                            data={url}
                            type="application/pdf"
                            width="100%"
                            height="100%"
                        >
                            {/* eslint-disable-next-line jsx-a11y/iframe-has-title */}
                            <iframe src={url} />
                        </object>
                    </div>
                </div>
            </div>
        );
    }
}

// import React, { Component } from "react";
// import CodeMirror from "@uiw/react-codemirror";
// import "codemirror/addon/display/autorefresh";
// import "codemirror/addon/comment/comment";
// import "codemirror/addon/edit/matchbrackets";
// import "codemirror/keymap/sublime";
// import "codemirror/theme/dracula.css";

// const code = "const a = 0;";
// class App extends Component {
//     render() {
//         return (
//             <div>
//                 <CodeMirror
//                     value={code}
//                     options={{
//                         theme: "dracula",
//                         tabSize: 4,
//                         keyMap: "sublime",
//                         mode: "jsx",
//                     }}
//                 />
//             </div>
//         );
//     }
// }

// export default App;

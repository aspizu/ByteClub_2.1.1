import {
    Button,
    Card,
    CardBody,
    CardHeader,
    Divider,
    Image,
    Textarea,
} from "@nextui-org/react"
import {useState} from "react"
// import {session} from "~/globalState"

// import {LexicalComposer} from "@lexical/react/LexicalComposer"
// import {useLexicalComposerContext} from "@lexical/react/LexicalComposerContext"
// import {ContentEditable} from "@lexical/react/LexicalContentEditable"
// import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary"
// import {HistoryPlugin} from "@lexical/react/LexicalHistoryPlugin"
// import {PlainTextPlugin} from "@lexical/react/LexicalPlainTextPlugin"

import AttachFileIcon from "@mui/icons-material/AttachFile"
import SendIcon from "@mui/icons-material/Send"
import * as api from "~/api"
import {session} from "~/globalState"

// function MyCustomAutoFocusPlugin() {
//     const [editor] = useLexicalComposerContext()

//     useEffect(() => {
//         // Focus the editor when the effect fires!
//         editor.focus()
//     }, [editor])

//     return null
// }
// function onError(error: any) {
//     console.error(error)
// }

// function MyOnChangePlugin({onChange}) {
//     const [editor] = useLexicalComposerContext()
//     useEffect(() => {
//         return editor.registerUpdateListener(({editorState}) => {
//             onChange(editorState)
//         })
//     }, [editor, onChange])
//     return null
// }

// const [editorState, setEditorState] = useState("")
// let [currentUser, setCurrentuser] = useState(session.value?.username)
// function sendButtonHandler() {
//     api.post_blog(currentUser || "", editorState?.root.children[0].children[0].text)
//     setEditorState("")
//     console.log(editorState?.root.children[0].children[0].text)
// }
// const theme = {}
// const initialConfig = {
//     namespace: "MyEditor",
//     theme,
//     onError,
// }
// function onChange(editorState) {
//     // Call toJSON on the EditorState object, which produces a serialization safe string
//     const editorStateJSON = editorState.toJSON()
//     // However, we still have a JavaScript object, so we need to convert it to an actual string with JSON.stringify
//     setEditorState(JSON.stringify(editorStateJSON))
// }

function Writeblog() {
    let [caption, setCaption] = useState("")
    const [selectedImage, setSelectedImage] = useState(null)
    let [currentUser, serCurrentUser] = useState(session.value?.username)

    function mySendButtonHandler() {
        api.post_blog(currentUser || "", caption)
        setCaption("")
    }

    return (
        <Card className="bg-slate-900 w-6/12 rounded-md pt-4">
            <CardHeader className="flex gap-3 bg-black">
                {/* <LexicalComposer initialConfig={initialConfig}>
                    <PlainTextPlugin
                        contentEditable={<ContentEditable />}
                        placeholder={<>.</>}
                        ErrorBoundary={LexicalErrorBoundary}
                    />

                    <HistoryPlugin />
                    <MyCustomAutoFocusPlugin />
                    <MyOnChangePlugin onChange={onChange} />
                </LexicalComposer> */}
                <Textarea
                    label="Post"
                    placeholder="Share your thoughts..."
                    className="max-w-xs"
                    onChange={(e) => setCaption(e.target.value)}
                />
            </CardHeader>
            <Divider />
            <CardBody className="flex flex-row items-center justify-between left-0 m-0">
                <Image
                    isBlurred
                    width={80}
                    src="https://nextui-docs-v2.vercel.app/images/album-cover.png"
                    alt="Profile picture"
                    className="m-5 rounded-full flex"
                />
                {currentUser || "Username not available"}
                <div className="p-4">
                    <Button color="primary" variant="ghost">
                        <AttachFileIcon />
                    </Button>

                    <Button
                        color="primary"
                        variant="bordered"
                        onClick={mySendButtonHandler}
                    >
                        <SendIcon />
                    </Button>
                </div>
            </CardBody>
            <Divider />
        </Card>
    )
}

export default Writeblog

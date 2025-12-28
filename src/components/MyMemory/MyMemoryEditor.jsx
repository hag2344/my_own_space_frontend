import { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Editor } from "@toast-ui/react-editor";
import { myMemoryApi, unwrapResponse } from "../../api/mymemoryApi";
import Button from "../common/Button";
import "./MyMemoryEditor.css";
import AutoResizeTextarea from "../common/AutoResizeTextarea";

const MAX_IMAGE_SIZE = 50 * 1024 * 1024;

const MyMemoryEditor = ({
  initialTitle = "",
  initialContent = "", // HTML
  initialImagePaths = [], // 서버에서 내려준 이 글의 이미지 path 목록
  onSubmit, // (payload) => Promise<void>
}) => {
  const [title, setTitle] = useState(initialTitle);
  const [isSaving, setIsSaving] = useState(false);
  const editorRef = useRef(null);

  const navigate = useNavigate();

  // 이 글에서 사용 중인 이미지 path 모음
  const imagePathsRef = useRef(new Set(initialImagePaths));
  // url -> path 매핑 (HTML에서 사용 중 이미지 판단용)
  const urlToPathMapRef = useRef(new Map());

  // Supabase signed URL에서 실제 object path 추출
  const extractPathFromSupabaseUrl = (src) => {
    if (!src) return null;

    try {
      const url = new URL(src);
      // /object/sign/{bucket}/{path...}
      const match = url.pathname.match(/\/object\/sign\/[^/]+\/(.+)/);
      if (match && match[1]) {
        // path 부분 (예: "mymemory/uuid.png")
        return decodeURIComponent(match[1]);
      }
    } catch (err) {
      // new URL 실패 시 무시
      console.warn("URL 파싱 실패:", err);
    }
    return null;
  };

  // Toast UI 이미지 업로드 훅
  const handleAddImageBlob = async (blob, callback) => {
    try {
      if (blob.size > MAX_IMAGE_SIZE) {
        alert("이미지 용량은 최대 50MB까지 업로드할 수 있습니다.");
        return;
      }

      const res = await myMemoryApi.uploadImage(blob);
      const { path, url } = unwrapResponse(
        res,
        "이미지 업로드에 실패했습니다."
      );

      // 에디터에 삽입될 실제 URL
      callback(url, "image");

      // path, url 둘 다 기록해 둔다
      imagePathsRef.current.add(path);
      urlToPathMapRef.current.set(url, path);
    } catch (err) {
      console.error("이미지 업로드 실패:", err);
      alert(err.message || "이미지 업로드에 실패했습니다.");
    }
  };

  // HTML에서 실제 사용 중인 이미지 path만 추리기
  const extractUsedImagePaths = (html) => {
    const usedPaths = new Set();

    if (typeof DOMParser !== "undefined") {
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, "text/html");
      const imgs = doc.querySelectorAll("img");

      imgs.forEach((img) => {
        const src = img.getAttribute("src");
        if (!src) return;

        // 1순위: 업로드 시점에 기록한 url -> path 매핑
        let path = urlToPathMapRef.current.get(src);

        // 2순위: Supabase signed URL에서 path 추출
        if (!path) {
          path = extractPathFromSupabaseUrl(src);
        }

        // 3순위: 그래도 path를 못 찾으면 일단 버림
        if (path) {
          usedPaths.add(path);
        }
      });
    } else {
      // 혹시 브라우저가 아니면, 일단 기존 기록값을 그대로 쓰기 (fallback)
      imagePathsRef.current.forEach((p) => usedPaths.add(p));
    }

    return Array.from(usedPaths);
  };

  const handleSubmit = async () => {
    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      alert("제목을 입력해 주세요.");
      return;
    }

    const editorInstance = editorRef.current?.getInstance();
    const html = editorInstance?.getHTML() || "";

    if (!html || html === "<p><br></p>") {
      alert("내용을 입력해 주세요.");
      return;
    }

    // 실제 HTML에 남아있는 이미지들 기준으로 path 추출
    const imagePaths = extractUsedImagePaths(html);

    const payload = {
      title: trimmedTitle,
      contentHtml: html,
      imagePaths,
    };

    try {
      setIsSaving(true);
      await onSubmit?.(payload);
    } catch (err) {
      console.error("추억 저장 실패:", err);
      alert(err.message || "추억 저장에 실패했습니다.");
    } finally {
      setIsSaving(false);
    }
  };

  // 수정 모드일 때 initialTitle이 바뀌면 input에도 반영
  useEffect(() => {
    setTitle(initialTitle);
  }, [initialTitle]);

  return (
    <div className="mymemory-editor-wrapper">
      <div className="mymemory-editor-header">
        <AutoResizeTextarea
          className="mymemory-title-input"
          placeholder="제목을 입력하세요"
          value={title}
          maxLength={100}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      <div className="mymemory-content-input">
        <Editor
          ref={editorRef}
          initialValue={initialContent || ""}
          previewStyle="vertical"
          height="auto"
          initialEditType="wysiwyg"
          useCommandShortcut={true}
          hideModeSwitch={true}
          hooks={{
            addImageBlobHook: handleAddImageBlob,
          }}
          toolbarItems={[
            ["image", "heading", "bold", "italic", "strike"],
            ["hr", "quote"],
            ["ul", "ol"],
            ["link"],
          ]}
        />
      </div>

      <div className="mymemory-editor-action">
        <Button
          text={isSaving ? "저장 중..." : initialTitle ? "수정" : "등록"}
          type={"New"}
          onClick={handleSubmit}
        />
        <Button text={"뒤로가기"} type={"Basic"} onClick={() => navigate(-1)} />
      </div>
    </div>
  );
};

export default MyMemoryEditor;

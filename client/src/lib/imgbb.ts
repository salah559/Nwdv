export const IMGBB_API_KEY = "a31676fa2d36403c4ef5e813ca5ae571";

/**
 * Uploads an image file to ImgBB and returns the direct public URL.
 * @param file The image File selected by the user.
 * @returns Promise<string> Direct image URL.
 */
export async function uploadImageToImgBB(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("image", file);

  const response = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData?.error?.message || "فشل رفع الصورة إلى خادم ImgBB");
  }

  const json = await response.json();
  if (json.success && json.data) {
    return json.data.display_url || json.data.url;
  }

  throw new Error("لم يتم استلام رابط صالح للصورة");
}

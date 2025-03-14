export interface Blog {
  blogId: number;
  categoryId: number;
  categoryName: string;
  title: string;
  content: string;
  therapistName: string;
  approve: boolean;
  img: string;
}

export const blogData = async (): Promise<Blog[]> => {
  return [
    {
      blogId: 1,
      categoryId: 1,
      categoryName: "Chăm sóc da",
      title: "Cách chăm sóc da dầu",
      content: "Da dầu cần được làm sạch thường xuyên để tránh mụn...",
      therapistName: "Nguyễn Văn A",
      approve: true,
      img: "/images/da-dau.jpg",
    },
    {
      blogId: 2,
      categoryId: 2,
      categoryName: "Chăm sóc tóc",
      title: "Mẹo giữ tóc khỏe mạnh",
      content: "Tóc cần được dưỡng ẩm và cắt tỉa định kỳ...",
      therapistName: "Trần Thị B",
      approve: true,
      img: "/images/toc-khoe.jpg",
    },
    // Thêm blog khác...
  ];
};
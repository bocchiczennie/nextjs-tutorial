import {useState} from "react";
import {GetServerSideProps} from "next";
import "semantic-ui-css/semantic.min.css";
import {Loader} from "semantic-ui-react";

interface SearchCatImage {
    id: string;
    url: string;
    width: number;
    height: number;
}

interface indexPageProps {
    initialCatImageUrl: string;
}

const fetchCatImage = async (): Promise<SearchCatImage> => {
    const res = await fetch("https://api.thecatapi.com/v1/images/search");
    const result = await res.json();
    return result[0];
}

export default function Home({ initialCatImageUrl }: indexPageProps) {
    const [catImageUrl, setCatImageUrl] = useState(initialCatImageUrl);
    const [isLoading, setIsLoading] = useState(false);

    const handleClick = async () => {
        setIsLoading(true);
        const catImage = await fetchCatImage();
        setCatImageUrl(catImage.url)
        setIsLoading(false);
    }

    return (
        <div style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: "100vh",
            fontFamily: "var(--font-geist-sans)",
        }}>
            <h1>猫画像アプリ</h1>
            {isLoading ? (
                <Loader active size="huge" inline="centered" />
            ) : (
                <img
                    src={catImageUrl}
                    width={500}
                    height={500}
                />
            )}
            <button onClick={handleClick} style={{marginTop: 16}}>今日の猫さん</button>
        </div>
    );
}

// SSR（サーバーサイドレンダリング）
export const getServerSideProps: GetServerSideProps<indexPageProps> = async () => {
    const catImage = await fetchCatImage();
    return {
        props: {
            initialCatImageUrl: catImage.url,
        }
    }
};
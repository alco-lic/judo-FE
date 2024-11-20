import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const KnnProcessGraph = ({ data }) => {
    if (!data || data.length === 0) {
        return <p>과정 데이터가 없습니다.</p>;
    }
    const graphData = data.map((item, index) => ({
        name: item.name, // 음료 이름
        similarity: item.similarity, // 유사도 점수
    }));

    // console.log(graphData)

    return (
        <BarChart
            width={600}
            height={300}
            data={graphData}
            margin={{
                top: 5, right: 30, left: 20, bottom: 5,
            }}
        >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="similarity" fill="#8884d8" />
        </BarChart>
    );
};

export default KnnProcessGraph;

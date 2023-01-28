/* eslint-disable import/first */
import type { LoaderFunction } from 'remix';
import { db } from '~/utils/db.server'; // Prisma ORM being used

export const loader: LoaderFunction = async ({ request }) => {
  const from = Number(new URL(request.url).searchParams.get("from"));
  const to = Number(new URL(request.url).searchParams.get("to"));

  if (from >= 0 && to > 0) {
    const posts = await db.post.findMany({
      skip: from,
      take: to - from,
      select: {
        id: true,
        title: true,
        updatedAt: true,
        author: {
          select: {
            email: true,
            name: true,
          },
        },
      },
    });

    return posts;
  }
  return [];
}


import { useFetcher } from 'remix';
import { useCallback, useEffect, useState } from 'react';
import { AgGridReact } from "ag-grid-react";
import AgGridStyles from "ag-grid-community/dist/styles/ag-grid.css";
import AgThemeAlpineStyles from "ag-grid-community/dist/styles/ag-theme-alpine.css";

export default function PostsRoute() {
  const [isFetching, setIsFetching] = useState(false);
  const [getRowParams, setGetRowParams] = useState(null);
  const posts = useFetcher();
  
  const onGridReady = useCallback((params) => {
    const datasource = {
    getRows(params) {
      if (!isFetching) {
        posts.load(`/posts?from=${params.startRow}&to=${params.endRow}`);

        setGetRowParams(params);
        setIsFetching(true);
      }
    },
  };

  params.api.setDatasource(datasource);
  }, []);

  useEffect(() => {
  // The useEffect hook in this code will trigger when the fetcher has 
  // loaded new data. If a successCallback is available, it’ll call it, 
  // passing the loaded data and the last row to load
  if (getRowParams) {
    const data = posts.data || [];

    getRowParams.successCallback(
      data,
      data.length < getRowParams.endRow - getRowParams.startRow
        ? getRowParams.startRow
        : -1
    );
  }

  setIsFetching(false);
  setGetRowParams(null);
}, [posts.data, getRowParams]);

  const columnDefs = [/* Your columnDefs */];

  return (
    <div className="ag-theme-alpine" style={{ width: "100%", height: "100%" }}>
      <AgGridReact
        columnDefs={columnDefs}
        rowModelType="infinite"
        onGridReady={onGridReady}
      />
    </div>
  );
}
const data = [{ average: 3 }, {average: 8}, {average: 2}];
const sortedData = data.sort((a, b) => a.average - b.average);



import Head from 'next/head';
import { useState } from 'react';
import { connectToDatabase } from '../util/mongodb';

export default function Home({ properties }) {
  const [searchTerm, setSearchTerm] = useState('');
  return (
    <div className='container'>
      <Head>
        <title>Entrepotes</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <main>
        <h1 className='title'>
          Cherchez une Annonce sur{' '}
          <a href='https://www.entrepotes.ca/'>Entrepotes.ca!</a>
        </h1>
        <br />
        <div className='search'>
          <input
            type='text'
            placeholder='Cherchez un localisation...'
            onChange={(event) => {
              setSearchTerm(event.target.value);
            }}
          />
        </div>
        <div className='grid'>
          {properties
            .filter((property) => {
              if (searchTerm === '') {
                return property;
              }
              if (
                property.address
                  .toLowerCase()
                  .includes(searchTerm.toLowerCase())
              ) {
                return property;
              }
            })
            .map((property, key) => {
              return (
                <a href='https://www.entrepotes.ca/' className='card' key={key}>
                  <h3>{property.title}</h3>
                  <p>--- {property.address.toUpperCase()} ---</p>
                  <p>Prix de l'espace : {property.price} $CAD/mois</p>
                  <br />
                  <img src={property.image} className='image' />
                  <br />
                  <p>Hote : </p>
                </a>
              );
            })}
        </div>
      </main>
      <style jsx>{`
        .container {
          min-height: 100vh;
          padding: 0 0.5rem;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }

        main {
          padding: 5rem 0;
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }

        footer {
          width: 100%;
          height: 100px;
          border-top: 1px solid #eaeaea;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        footer img {
          margin-left: 0.5rem;
        }

        footer a {
          display: flex;
          justify-content: center;
          align-items: center;
        }

        a {
          color: inherit;
          text-decoration: none;
        }

        .title a {
          color: #0070f3;
          text-decoration: none;
        }

        .title a:hover,
        .title a:focus,
        .title a:active {
          text-decoration: underline;
        }

        .title {
          margin: 0;
          line-height: 1.15;
          font-size: 4rem;
        }

        .title,
        .description {
          text-align: center;
        }

        .subtitle {
          font-size: 2rem;
        }

        .description {
          line-height: 1.5;
          font-size: 1.5rem;
        }

        code {
          background: #fafafa;
          border-radius: 5px;
          padding: 0.75rem;
          font-size: 1.1rem;
          font-family: Menlo, Monaco, Lucida Console, Liberation Mono,
            DejaVu Sans Mono, Bitstream Vera Sans Mono, Courier New, monospace;
        }

        .grid {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-wrap: wrap;

          max-width: 800px;
          margin-top: 3rem;
        }

        .card {
          margin: 1rem;
          flex-basis: 45%;
          padding: 1.5rem;
          text-align: left;
          color: inherit;
          text-decoration: none;
          border: 5px solid #eaeaea;
          border-radius: 30px;
          transition: color 0.15s ease, border-color 0.15s ease;
        }

        .card:hover,
        .card:focus,
        .card:active {
          color: #0070f3;
          border-color: #0070f3;
        }

        .card h3 {
          margin: 0 0 1rem 0;
          font-size: 1.5rem;
        }

        .card p {
          margin: 0;
          font-size: 1.25rem;
          line-height: 1.5;
        }

        .logo {
          height: 1em;
        }

        .image {
          width: 300px;
          height: 300px;
        }

        @media (max-width: 600px) {
          .grid {
            width: 100%;
            flex-direction: column;
          }
        }
      `}</style>
      <style jsx global>{`
        html,
        body {
          padding: 0;
          margin: 0;
          font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto,
            Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue,
            sans-serif;
        }

        * {
          box-sizing: border-box;
        }
      `}</style>
    </div>
  );
}

// -------------------DEFAULT CODE------------------------

// // This function checks if the client is connected to the database. If yes, it returns true
// export async function getServerSideProps(context) {
//   const { client } = await connectToDatabase();

//   const isConnected = await client.isConnected(); // Returns true or false

//   return {
//     // Then, we are sending this boolean as a prop component
//     props: { isConnected },
//   };
// }

// -----------------MY CODE----------------------------
export async function getServerSideProps(context) {
  const { db } = await connectToDatabase();

  // These are MongoDB methods. We get all our data from a collection called 'annonces' thanks to find(). Then, we sort them by id and we get the last 10 annonces. Also, we convert that data to an array. As it is a promise, we can use the async await.
  const data = await db
    .collection('annonces')
    .find()
    .sort({ _id: 1 })
    .limit(10)
    .toArray();

  const properties = data.map((property) => {
    // to convert int to string because having an int will return an error
    // const price = JSON.parse(JSON.stringify(property.price));

    return {
      title: property.title,
      image: property.images.pictures_url,
      address: property.address,
      // converts the price object to a decimal number string
      price: property.price,
    };
  });

  return {
    // Then, we are sending this boolean as a prop component
    props: { properties },
  };
}

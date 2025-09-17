import Image from 'next/image';

export default function SobrePage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-12">
      <div className="flex flex-col items-center mb-8">
        <Image src="/logo.png" alt="Lura Logo" width={96} height={96} className="mb-4" />
        <h1 className="text-3xl font-bold mb-2">Sobre o Lura</h1>
        <p className="text-lg text-gray-600 text-center max-w-xl">
          O Lura é uma plataforma inovadora que une inteligência artificial, localização e tecnologia para apoiar agricultores e comunidades rurais. Nosso objetivo é facilitar o acesso a informações climáticas, localização de torres de celular, integração de APIs e automação de processos agrícolas.
        </p>
      </div>
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Missão</h2>
        <p>
          Democratizar o acesso à tecnologia e inteligência de dados no campo, promovendo sustentabilidade, produtividade e inclusão digital para agricultores de todos os portes.
        </p>
      </section>
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Visão</h2>
        <p>
          Ser referência em soluções digitais para o agronegócio, conectando pessoas, dados e inovação para transformar a agricultura do futuro.
        </p>
      </section>
      <section>
        <h2 className="text-xl font-semibold mb-2">Nossa História</h2>
        <p>
          O projeto Lura nasceu da necessidade de integrar diferentes fontes de dados e tecnologias (como APIs de clima, localização de torres, sensores e IA) em uma plataforma acessível e fácil de usar. Combinando expertise em software, ciência de dados e experiência no campo, evoluímos para atender demandas reais de produtores e comunidades.
        </p>
      </section>
      
      <section className="mt-12">
        <h2 className="text-xl font-semibold mb-6 text-center">Equipe</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Faife */}
          <div className="bg-white/80 dark:bg-green-800/80 p-6 rounded-2xl shadow-md border border-green-200 dark:border-green-700">
            <div className="flex flex-col items-center">
              <Image src="/logo.png" alt="Faife" width={96} height={96} className="rounded-full mb-4" />
              <h3 className="text-lg font-bold text-green-800 dark:text-green-100 mb-2">Faife de Felix Gregório Fortunato</h3>
              <p className="text-sm text-green-700 dark:text-green-200 text-center">
                Estudante de Engenharia Agronômica e Desenvolvimento Rural. Movido pela paixão pela agricultura, acredita no poder transformador do sector como base para a construção de um Moçambique mais próspero e de um mundo melhor. Sua motivação está em contribuir para soluções sustentáveis que impactem positivamente a vida das comunidades rurais e promovam o desenvolvimento agrícola.
              </p>
            </div>
          </div>

          {/* Shaquil */}
          <div className="bg-white/80 dark:bg-green-800/80 p-6 rounded-2xl shadow-md border border-green-200 dark:border-green-700">
            <div className="flex flex-col items-center">
              <Image src="/logo.png" alt="Shaquil" width={96} height={96} className="rounded-full mb-4" />
              <h3 className="text-lg font-bold text-green-800 dark:text-green-100 mb-2">Shaquil Dário Francisco</h3>
              <p className="text-sm text-green-700 dark:text-green-200 text-center">
                Estudante de Engenharia Agronômica e Desenvolvimento Rural. Desde o ensino básico teve contato com a agricultura e transformou esse interesse em vocação. Apaixonado pelo campo e pelo potencial de crescimento do país, busca contribuir para o desenvolvimento rural de Moçambique e para práticas agrícolas mais sustentáveis e inovadoras.
              </p>
            </div>
          </div>

          {/* Joel */}
          <div className="bg-white/80 dark:bg-green-800/80 p-6 rounded-2xl shadow-md border border-green-200 dark:border-green-700">
            <div className="flex flex-col items-center">
              <Image src="/logo.png" alt="Joel" width={96} height={96} className="rounded-full mb-4" />
              <h3 className="text-lg font-bold text-green-800 dark:text-green-100 mb-2">Joel Lasmim</h3>
              <p className="text-sm text-green-700 dark:text-green-200 text-center">
                Estudante de Engenharia Agronômica e Desenvolvimento Rural, apaixonado pela agricultura e pela programação. Criativo e visionário, foi o programador da plataforma desenvolvida para apoiar os agricultores, unindo tecnologia e agronomia em uma solução inovadora. Sua dedicação está voltada para integrar o conhecimento digital com as práticas agrícolas, trazendo inovação e eficiência ao setor.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

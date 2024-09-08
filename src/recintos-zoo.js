class RecintosZoo {

    analisaRecintos(animal, quantidade) {
        const animais = ["LEAO", "LEOPARDO", "CROCODILO", "MACACO", "GAZELA", "HIPOPOTAMO"];
        // Verifica se o animal é valido
        if (!animais.includes(animal)) {
            return {
                erro: "Animal inválido",
                recintosViaveis: false
            };
        }

        // Verifica se a quantidade é valida
        if (quantidade <= 0) {
            return {
                erro: "Quantidade inválida",
                recintosViaveis: false
            };
        }

        // Criação dos recintos
        var recinto1 = { num: 1, bioma: ["savana"], tamanho: 10, animais: ["MACACO", "MACACO", "MACACO"] };
        var recinto2 = { num: 2, bioma: ["floresta"], tamanho: 5, animais: [] };
        var recinto3 = { num: 3, bioma: ["savana", "rio"], tamanho: 7, animais: ["GAZELA"] };
        var recinto4 = { num: 4, bioma: ["rio"], tamanho: 8, animais: [] };
        var recinto5 = { num: 5, bioma: ["savana"], tamanho: 9, animais: ["LEAO"] };

        // Armazenando os recintos possiveis
        /* A minha função analisaRecintos() deduz no inicio que os 5 recintos são validos para a
        insercao do animal, e após isso executa um processo de eliminição conforme as regras para
        encontrar um recinto
        */
        var recintosPossiveis = [recinto1, recinto2, recinto3, recinto4, recinto5];

        // Preenchendo todos os recintos com o animal e quantidade informada
        recintosPossiveis.forEach(recinto => {
            for (let i = 0; i < quantidade; i++) {
                recinto.animais.push(animal);
            }
        })

        // Verifica se a quantidade de animais inseridos não ultrapassa o tamanho do recinto
        var recPos2 = []; // recPos2 seria a abreviação de recintosPossiveis2 (variavel auxiliar)
        for (let i = 0; i < recintosPossiveis.length; i++) {
            if (this.espacoOcupado(recintosPossiveis[i]) <= recintosPossiveis[i].tamanho) {
                recPos2.push(recintosPossiveis[i]);
            }
        }
        recintosPossiveis = recPos2; //Retorno apenas os que não ultrapassam o tamanho do recinto

        // Um animal carnivoro só pode dividir habitat com a mesma especie
        // Se o animal a ser adicionado for carnivoro, mantem apenas os recintos com a mesma especie
        const animaisCarnivoros = ["LEAO", "LEOPARDO", "CROCODILO"];
        if (animaisCarnivoros.includes(animal)) {
            recPos2 = [];
            for (let i = 0; i < recintosPossiveis.length; i++) {
                let todosIguais = true;
                for (let j = 0; j < recintosPossiveis[i].animais.length; j++) {
                    if (animal != recintosPossiveis[i].animais[j]) {
                        todosIguais = false;
                        break;
                    }
                }
                if (todosIguais) recPos2.push(recintosPossiveis[i]);
            }
        } else { // Se o animal a ser adicionado for herbivoro, mantem apenas os recintos sem nenhum carnivoro
            recPos2 = [];
            for (let i = 0; i < recintosPossiveis.length; i++) {
                let possuiCarnivoro = false;
                for (let j = 0; j < recintosPossiveis[i].animais.length; j++) {
                    if (animaisCarnivoros.includes(recintosPossiveis[i].animais[j])) {
                        possuiCarnivoro = true;
                        break;
                    }
                }
                if (!possuiCarnivoro) {
                    recPos2.push(recintosPossiveis[i]);
                }
            }
        }
        recintosPossiveis = recPos2;

        // Verifica se os animais estão em seus biomas validos
        recPos2 = [];
        for (let i = 0; i < recintosPossiveis.length; i++) {
            let recintoValido = true;
            for (let j = 0; j < recintosPossiveis[i].animais.length; j++) {
                if (!this.biomaValido(recintosPossiveis[i].bioma, recintosPossiveis[i].animais[j])) {
                    recintoValido = false;
                }
            }
            if (recintoValido) {
                recPos2.push(recintosPossiveis[i]);
            }
        }
        recintosPossiveis = recPos2;

        // Hipopótamo(s) só tolera(m) outras espécies estando num recinto com savana e rio
        if (animal == "HIPOPOTAMO") {
            recPos2 = [];
            recintosPossiveis.forEach(recinto => {
                if (this.qtdAnimais(recinto) <= 1) recPos2.push(recinto);
                else {
                    if (recinto.bioma.includes("savana") && recinto.bioma.includes("rio")) {
                        recPos2.push(recinto);
                    }
                }
            });
            recintosPossiveis = recPos2;
        }
        
        // Um macaco não se sente confortável sem outro animal no recinto, seja da mesma ou outra espécie
        if (animal == "MACACO") {
            recPos2 = [];
            recintosPossiveis.forEach(recinto => {
                if(recinto.animais.length > 1) recPos2.push(recinto);
            });
            recintosPossiveis = recPos2;
        }

        // Caso não haja nenhum recinto, lança um erro
        if (recintosPossiveis.length === 0) {
            return {
                erro: "Não há recinto viável",
                recintosViaveis: false
            };
        } else { // Caso haja recintos, converte em String e o retorna dentro de uma lista
            let recintosPossiveisFormatados = []
            recintosPossiveis.forEach(recinto => {
                recintosPossiveisFormatados.push(this.formata(recinto))
            })
            return {
                erro: false,
                recintosViaveis: recintosPossiveisFormatados
            };
        }
    }


    // ----------------------- Funções Auxiliares -----------------------
    
    // Calcula quanto de espaço ja foi ocupado em um determinado recinto
    espacoOcupado(recinto) {
        let qtd = 0;
        recinto.animais.forEach(animal => {
            switch (animal) {
                case "LEAO":
                    qtd += 3;
                    break;
                case "LEOPARDO":
                    qtd += 2;
                    break;
                case "CROCODILO":
                    qtd += 3;
                    break;
                case "MACACO":
                    qtd += 1;
                    break;
                case "GAZELA":
                    qtd += 2;
                    break;
                case "HIPOPOTAMO":
                    qtd += 4;
                    break;
            }
        });

        // Verifica se há mais de uma especie no mesmo recinto
        let animal = "";
        for (let i = 0; i < recinto.animais.length; i++) {
            if (i == 0) animal = recinto.animais[i];
            else {
                if (animal != recinto.animais[i]) {
                    qtd += 1;
                    break;
                }
            }
        }
        return qtd;
    }

    // Verifica se o animal pertence a aquele bioma e retorna True ou False
    biomaValido(biomas, animal) {
        // Basicamente percorre todos os biomas fornecidos e verifica se o animal entra em algum deles
        switch (animal) {
            case "LEAO":
                for (let i = 0; i < biomas.length; i++) {
                    if (biomas[i] == "savana") return true;
                }
                return false;
            case "LEOPARDO":
                for (let i = 0; i < biomas.length; i++) {
                    if (biomas[i] == "savana") return true;
                }
                return false;
            case "CROCODILO":
                for (let i = 0; i < biomas.length; i++) {
                    if (biomas[i] == "rio") return true;
                }
                return false;
            case "MACACO":
                for (let i = 0; i < biomas.length; i++) {
                    if (biomas[i] == "savana" || biomas[i] == "floresta") return true;
                }
                return false;
            case "GAZELA":
                for (let i = 0; i < biomas.length; i++) {
                    if (biomas[i] == "savana") return true;
                }
                return false;
            case "HIPOPOTAMO":
                for (let i = 0; i < biomas.length; i++) {
                    if (biomas[i] == "savana" || biomas[i] == "rio") return true;
                }
                return false;
        }
    }

    // Conta quantos animais diferentes situam o mesmo recinto
    qtdAnimais(recinto) {
        let animaisNoRecinto = [];
        recinto.animais.forEach(animal => {
            if (!animaisNoRecinto.includes(animal)) {
                animaisNoRecinto.push(animal);
            }
        });
        return animaisNoRecinto.length;
    }

    // Converte o dicionario recinto em uma String
    formata(recinto) {
        return "Recinto " + recinto.num + " (espaço livre: "
            + (recinto.tamanho - this.espacoOcupado(recinto)) + " total: " + recinto.tamanho + ")";
    }
}

export { RecintosZoo as RecintosZoo };

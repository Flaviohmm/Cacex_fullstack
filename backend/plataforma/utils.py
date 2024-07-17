from django.utils import timezone
from decimal import Decimal
from datetime import datetime, timedelta


def calcular_valores(registro):
    # Converter os valores para decimais
    valor_total = Decimal(str(registro.oge_ogu)) + Decimal(str(registro.cp_prefeitura))
    falta_liberar = Decimal(str(registro.oge_ogu)) - Decimal(str(registro.valor_liberado))

    # Calcular o Valor Total e Falta Liberar
    return valor_total, falta_liberar


def exibir_modal_prazo_vigencia(registro):
    hoje = timezone.now().date()
    try:
        dias_restantes = (registro.prazo_vigencia - hoje).days
        return dias_restantes <= 30, dias_restantes
    except Exception as e:
        # Log da exceção ou outro tratamento apropriado
        return False, 0


def dia_trabalho_total(data_inicio, data_fim):
    if not data_inicio or not data_fim:
        return 0

    # Converta para objetos date, se necessário
    if isinstance(data_inicio, str):
        data_inicio = datetime.strptime(data_inicio, "%Y-%m-%d").date()
    if isinstance(data_fim, str):
        data_fim = datetime.strptime(data_fim, "%Y-%m-%d").date()

    delta = data_fim - data_inicio
    dias_uteis = sum(1 for i in range(delta.days + 1) if (data_inicio + timedelta(days=i)).weekday() < 5)

    return dias_uteis

def dados_atuais_registro(registro):
    dados_atuais = {
        'nome': registro.nome.nome,
        'orgao_setor': registro.orgao_setor.nome,
        'municipio': registro.municipio.nome,
        'atividade': registro.atividade.nome,
        'num_convenio': registro.num_convenio,
        'parlamentar': registro.parlamentar,
        'objeto': registro.objeto,
        'oge_ogu': registro.oge_ogu,
        'cp_prefeitura': registro.cp_prefeitura,
        'valor_liberado': registro.valor_liberado,
        'prazo_vigencia': registro.prazo_vigencia.strftime('%d/%m/%Y'),
        'situacao': registro.situacao,
        'providencia': registro.providencia,
        'data_recepcao': registro.data_recepcao.strftime('%d/%m/%Y'),
        'data_inicio': registro.data_inicio.strftime('%d/%m/%Y'),
        'documento_pendente': registro.documento_pendente,
        'documento_cancelado': registro.documento_cancelado,
        'data_fim': registro.data_fim.strftime('%d/%m/%Y'),
    }
    return dados_atuais

def comparar_valores(dados_anteriores, dados_atuais):
    diffs = []

    for key in dados_anteriores.keys():
        if dados_anteriores[key] != dados_atuais[key]:
            diffs.append({
                'campo': key,
                'anterior': dados_anteriores[key],
                'atual': dados_atuais[key],
            })
    
    return diffs
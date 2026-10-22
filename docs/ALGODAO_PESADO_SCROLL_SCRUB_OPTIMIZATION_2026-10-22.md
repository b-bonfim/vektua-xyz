# Algodão Pesado — otimização de fluidez do vídeo scroll-scrub

**Data:** 2026-10-22  
**Rota:** `/congrats/algodao-pesado`  
**Owner técnico:** Commerce — interface/frontend.  
**Estado:** proposta em branch; não equivale a release Hostinger ou resultado medido.

## Diagnóstico baseado no código anterior
O filme A é H.264 sem áudio a 1280×720/24 fps, montado de partes com SHA-256 verificado antes do build. O frontend pedia `video.currentTime` após cada `requestAnimationFrame` de progressão suavizada (podendo rodar a 60/120 Hz), aplicava `--ap-progress` à seção em cada quadro e aguardava um encadeamento de `seeked` para finalizar fila de posições. Buscar quadros intermediários que já ficaram obsoletos impõe trabalho adicional ao decodificador. A hipótese é consistente com microtravamentos percebidos, **sem medição direta em navegador nesta sessão**.

## Tratamento
- **Quantização ao material entregue:** destino do vídeo alinhado aos quadros 24 fps; não solicitar tempos subframe que não agregam conteúdo perceptível.
- **Backpressure:** máximo aproximado de 25 disparos de busca/s e nunca mais de uma busca simultânea. A fila preserva *apenas o alvo mais recente*.
- **Composição sincronizada:** o pôster só cede para o vídeo quando o quadro decodificado está próximo da rolagem atual.
- **Scroll responsivo:** progressão de capítulos continua no `requestAnimationFrame`, agora com resposta exponencial de 70 ms; mudanças do capítulo não forçam atualizações de CSS custom property a cada tick.
- **Cleanup:** cancelamento de dois laços rAF (rolagem e busca) no unmount, ao sair da região ou na transição para modo estático.
- **Escopo preservado:** nenhum MP4/pôster/logotipo/texto modificado. Film B (vídeo do mascote com áudio e play explícito) não foi tocado. Gates de mobile, portrait, `prefers-reduced-motion`, poster de fallback, compatibilidade com blob/Hostinger sem Range permanecem.

## Evidência de fonte
Teste de contrato estendido: `npm run check:algodao-ui`. Verificações estáticas podem demonstrar estrutura, preservação de fontes e integridade de seletores. **Não demonstram melhoria real de FPS**.

## Validação antes de aprovação/merge
1. `npm ci && npm run check:algodao-ui && npm run build:hostinger`
2. Chrome desktop 1440×900: rolagem lenta, rápida, reversa e arraste da scrollbar. Confirmar que o filme acompanha o gesto sem congelar, piscar ou expor pôster prematuramente.
3. Performance panel: capturar antes/depois no mesmo equipamento; comparar tempo de decodificação, tarefas longas e cadência perceptual dos frames. O número de seeks deverá cair, **mas não se promete 60 fps de imagem para um arquivo de 24 fps**.
4. Safari macOS/Chrome Windows; limitar carga em perfis de economia de energia e máquina intermediária. Verificar `seeked` e revelação inicial.
5. Mobile ≤850 px, portrait/reduced-motion: confirmar poster estático, sem download do filme do scroll, sem áudio.
6. Verificar que o vídeo final do mascote continua com áudio apenas sob interação.
7. Smoke HTTP e verificação Hostinger do SHA implantado se autorizado.

## Limite e próxima alternativa
Se ainda houver engasgos no hardware/browser de destino, testar transcodificação de **uma derivação nova de Film A** com keyframes mais frequentes (ex.: GOP 1–6) e comparar tamanho de arquivo, buffering e visual. Como o MP4 atual é empacotado com hash fixo em 10 partes, qualquer recodificação requer novos chunks, novo SHA/tamanho no assembler, comparação visual e aceitação explícita. **Não alterado nesta revisão**.

**Founder Gate:** aprovação após validação no browser e decisão posterior de merge/deploy. Não atualizar estado de produção por inferência.

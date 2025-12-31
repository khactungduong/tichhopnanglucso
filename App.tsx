
import React, { useState, useMemo } from 'react';
import { Upload, Download, Sparkles, User, FileText, CheckCircle2, Loader2, Info, FileSearch, ArrowRight, ChevronDown, ChevronRight, Layers, Target, Youtube } from 'lucide-react';
import { DIGITAL_COMPETENCY_FRAMEWORK } from './constants';
import { ProcessingMode } from './types';
import { integrateDigitalCompetency } from './services/geminiService';
import FileSaver from 'file-saver';
import mammoth from 'mammoth';
import * as pdfjs from 'pdfjs-dist';
import { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, WidthType, AlignmentType, HeadingLevel, BorderStyle, VerticalAlign } from 'docx';

// Set PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `https://esm.sh/pdfjs-dist@4.0.379/build/pdf.worker.mjs`;

const App: React.FC = () => {
  const [originalContent, setOriginalContent] = useState<string>('');
  const [mode, setMode] = useState<ProcessingMode>(ProcessingMode.AUTO);
  const [selectedIndicators, setSelectedIndicators] = useState<string[]>([]);
  const [expandedDomains, setExpandedDomains] = useState<string[]>(['NL1']);
  const [result, setResult] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [fileName, setFileName] = useState<string>('');
  const [isReading, setIsReading] = useState<boolean>(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    setIsReading(true);

    try {
      const fileType = file.name.split('.').pop()?.toLowerCase();
      if (fileType === 'docx') {
        const arrayBuffer = await file.arrayBuffer();
        const res = await mammoth.extractRawText({ arrayBuffer });
        setOriginalContent(res.value);
      } else if (fileType === 'pdf') {
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
        let fullText = '';
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const textContent = await page.getTextContent();
          const pageText = textContent.items.map((item: any) => item.str).join(' ');
          fullText += pageText + '\n';
        }
        setOriginalContent(fullText);
      } else {
        const text = await file.text();
        setOriginalContent(text);
      }
    } catch (error) {
      alert("Lỗi đọc file. Vui lòng thử lại với tệp Word hoặc PDF sạch.");
    } finally {
      setIsReading(false);
    }
  };

  const toggleIndicator = (code: string) => {
    setSelectedIndicators(prev => 
      prev.includes(code) ? prev.filter(c => c !== code) : [...prev, code]
    );
  };

  const toggleDomain = (id: string) => {
    setExpandedDomains(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const handleProcess = async () => {
    if (!originalContent) return;
    setIsProcessing(true);
    setResult('');
    try {
      const integratedText = await integrateDigitalCompetency(originalContent, mode, selectedIndicators);
      setResult(integratedText);
    } catch (error) {
      alert("Đã có lỗi xảy ra trong quá trình xử lý AI.");
    } finally {
      setIsProcessing(false);
    }
  };

  const isHeaderLine = (line: string): boolean => {
    const trimmed = line.trim();
    const headerRegex = /^([I|V|X]+\.|[0-9]+(\.[0-9]+)*\.|[a-z]\.|TIẾT|Hoạt động|MỤC TIÊU|VỀ PHẨM CHẤT|THIẾT BỊ|TIẾN TRÌNH|Thông tin chung|PHÁT TRIỂN NĂNG LỰC SỐ)/i;
    return headerRegex.test(trimmed);
  };

  // Helper to detect Lesson Info that needs centering and bolding
  const isLessonInfoLine = (line: string): boolean => {
    const trimmed = line.trim().toUpperCase();
    return (
      trimmed.startsWith('CHỦ ĐỀ') || 
      trimmed.startsWith('TÊN BÀI HỌC') || 
      trimmed.startsWith('THỜI GIAN THỰC HIỆN') ||
      /^BÀI \d+[:.]/.test(trimmed)
    );
  };

  const handleDownload = async () => {
    if (!result) return;

    const sections = result.split('\n');
    const docChildren: any[] = [];
    let currentTableRows: TableRow[] = [];
    let isInTable = false;

    const flushTable = () => {
      if (currentTableRows.length > 0) {
        docChildren.push(new Table({
          rows: currentTableRows,
          width: { size: 100, type: WidthType.PERCENTAGE },
          borders: {
            all: { style: BorderStyle.SINGLE, size: 1, color: "000000" }
          }
        }));
        currentTableRows = [];
      }
      isInTable = false;
    };

    sections.forEach((line) => {
      const trimmed = line.trim();
      
      if (trimmed.startsWith('|')) {
        if (trimmed.includes('---')) return;
        isInTable = true;
        const cells = trimmed.split('|').filter((_, idx, arr) => idx > 0 && idx < arr.length - 1);
        currentTableRows.push(new TableRow({
          children: cells.map(cell => new TableCell({
            children: [new Paragraph({
              children: [new TextRun({ text: cell.trim(), size: 26, font: "Times New Roman" })],
              spacing: { before: 100, after: 100 }
            })],
            verticalAlign: VerticalAlign.CENTER,
            width: { size: cell.trim().length > 50 ? 60 : 40, type: WidthType.PERCENTAGE }
          }))
        }));
        return;
      } else if (isInTable) {
        flushTable();
      }

      const isHeader = isHeaderLine(line);
      const isLessonInfo = isLessonInfoLine(line);

      if (line.startsWith('# ')) {
        docChildren.push(new Paragraph({
          children: [new TextRun({ text: line.replace('# ', ''), bold: true, size: 32, font: "Times New Roman" })],
          alignment: AlignmentType.CENTER,
          spacing: { before: 240, after: 120 }
        }));
      } else if (line.startsWith('## ')) {
        docChildren.push(new Paragraph({
          children: [new TextRun({ text: line.replace('## ', ''), bold: true, size: 28, font: "Times New Roman" })],
          spacing: { before: 200, after: 100 }
        }));
      } else if (line.startsWith('### ')) {
        docChildren.push(new Paragraph({
          children: [new TextRun({ text: line.replace('### ', ''), bold: true, size: 26, font: "Times New Roman" })],
          spacing: { before: 150, after: 80 }
        }));
      } else if (trimmed) {
        docChildren.push(new Paragraph({
          children: [new TextRun({ 
            text: trimmed, 
            size: 26, 
            font: "Times New Roman", 
            bold: isHeader || isLessonInfo 
          })],
          alignment: isLessonInfo ? AlignmentType.CENTER : AlignmentType.LEFT,
          spacing: { after: 120 }
        }));
      }
    });
    flushTable();

    const doc = new Document({
      sections: [{
        properties: { page: { margin: { top: 1134, right: 1134, bottom: 1134, left: 1701 } } }, 
        children: docChildren,
      }],
    });

    const blob = await Packer.toBlob(doc);
    const save = (FileSaver as any).saveAs || FileSaver;
    save(blob, `GiaoAn_Digital_${fileName.replace(/\.[^/.]+$/, "")}.docx`);
  };

  const previewElements = useMemo(() => {
    if (!result) return null;
    const lines = result.split('\n');
    const elements: React.ReactNode[] = [];
    let tableBuffer: string[][] = [];

    const flushBuffer = (key: number) => {
      if (tableBuffer.length > 0) {
        const table = (
          <table key={`table-${key}`} className="w-full border-collapse border border-black my-6">
            <tbody>
              {tableBuffer.map((row, ridx) => (
                <tr key={ridx}>
                  {row.map((cell, cidx) => (
                    <td key={cidx} className={`border border-black p-3 align-top ${ridx === 0 ? 'bg-gray-50 font-bold uppercase text-[11pt]' : 'text-[13pt]'}`}>
                      {cell.trim()}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        );
        tableBuffer = [];
        return table;
      }
      return null;
    };

    lines.forEach((line, i) => {
      const trimmed = line.trim();
      if (trimmed.startsWith('|')) {
        if (trimmed.includes('---')) return;
        const cells = trimmed.split('|').filter((_, idx, arr) => idx > 0 && idx < arr.length - 1);
        tableBuffer.push(cells);
      } else {
        const table = flushBuffer(i);
        if (table) elements.push(table);

        const isHeader = isHeaderLine(line);
        const isLessonInfo = isLessonInfoLine(line);

        if (line.startsWith('# ')) elements.push(<h1 key={i} className="text-center font-bold text-2xl my-8 uppercase text-black">{line.replace('# ', '')}</h1>);
        else if (line.startsWith('## ')) elements.push(<h2 key={i} className="font-bold text-xl mt-10 mb-5 border-b-2 border-black pb-1 uppercase">{line.replace('## ', '')}</h2>);
        else if (line.startsWith('### ')) elements.push(<h3 key={i} className="font-bold text-lg mt-6 mb-3">{line.replace('### ', '')}</h3>);
        else if (trimmed) {
          const html = trimmed.replace(/\(\d+\.\d+\.[a-d]\)/g, (match) => {
            return `<span class="bg-blue-600 text-white px-2 py-0.5 rounded-full font-bold text-xs shadow-sm mx-1">${match}</span>`;
          });
          elements.push(
            <p 
              key={i} 
              className={`mb-4 leading-relaxed text-[14pt] text-black ${isHeader || isLessonInfo ? 'font-bold' : ''} ${isLessonInfo ? 'text-center' : ''}`} 
              dangerouslySetInnerHTML={{ __html: html }} 
            />
          );
        }
      }
    });
    const finalTable = flushBuffer(9999);
    if (finalTable) elements.push(finalTable);
    
    return elements;
  }, [result]);

  return (
    <div className="flex flex-col h-screen overflow-hidden text-slate-900 bg-slate-100">
      {/* Navbar */}
      <header className="bg-white border-b px-10 py-5 flex items-center justify-between shadow-md relative z-20">
        <div className="flex items-center gap-4">
          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-2.5 rounded-2xl shadow-xl shadow-blue-100 animate-pulse">
            <Sparkles className="text-white w-6 h-6" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-2xl font-black bg-gradient-to-r from-blue-700 to-indigo-600 bg-clip-text text-transparent tracking-tight uppercase">Youtube Tùng Bê</h1>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] flex items-center gap-1">
              ứng dụng CNTT và AI vào dạy học
            </p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <a 
            href="https://www.youtube.com/@thaygiaovungcao" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-5 py-2.5 bg-red-50 text-red-600 rounded-xl font-black text-[11px] uppercase tracking-wider hover:bg-red-600 hover:text-white transition-all shadow-sm border border-red-100 group"
          >
            <Youtube className="w-4 h-4 group-hover:scale-110 transition-transform" />
            Truy cập kênh youtube
          </a>

          {result && (
            <button
              onClick={handleDownload}
              className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white px-8 py-3.5 rounded-2xl font-black transition-all shadow-2xl shadow-emerald-200 active:scale-95 border-b-4 border-emerald-800 text-[13px]"
            >
              <Download className="w-5 h-5" /> TẢI GIÁO ÁN WORD (.DOCX)
            </button>
          )}
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <div className="w-[480px] border-r bg-white overflow-y-auto p-10 custom-scrollbar shadow-2xl z-10">
          {/* Step 1: Upload */}
          <section className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <span className="flex items-center justify-center w-10 h-10 bg-blue-600 text-white font-black rounded-2xl shadow-lg shadow-blue-100 italic">1</span>
              <h2 className="text-sm font-black uppercase tracking-widest text-slate-700">Tải giáo án gốc</h2>
            </div>
            
            <div className={`relative border-4 border-dashed rounded-[2.5rem] p-12 text-center transition-all group overflow-hidden ${
              isReading ? 'border-blue-400 bg-blue-50/50' : 'border-slate-100 hover:border-blue-500 hover:bg-blue-50/30'
            }`}>
              <input type="file" onChange={handleFileUpload} className="absolute inset-0 opacity-0 cursor-pointer z-10" accept=".docx,.pdf,.txt,.md" />
              <div className="flex flex-col items-center gap-5">
                <div className={`p-6 rounded-3xl transition-all shadow-2xl ${fileName ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-400 group-hover:text-blue-500'} ${isReading ? 'animate-spin' : 'group-hover:scale-110'}`}>
                  {isReading ? <Loader2 className="w-10 h-10" /> : <Upload className="w-10 h-10" />}
                </div>
                <div>
                  <p className="text-base font-black text-slate-800 line-clamp-1">{fileName || 'Kéo thả file vào đây'}</p>
                  <p className="text-xs text-slate-400 mt-2 font-bold uppercase tracking-tighter">Word hoặc PDF (.docx, .pdf)</p>
                </div>
              </div>
            </div>
          </section>

          {/* Step 2: Mode Selection */}
          <section className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <span className="flex items-center justify-center w-10 h-10 bg-blue-600 text-white font-black rounded-2xl shadow-lg shadow-blue-100 italic">2</span>
              <h2 className="text-sm font-black uppercase tracking-widest text-slate-700">Chế độ tích hợp</h2>
            </div>
            <div className="grid gap-5">
              <button
                onClick={() => setMode(ProcessingMode.AUTO)}
                className={`flex items-center gap-6 p-7 rounded-[2rem] border-2 transition-all text-left relative overflow-hidden ${
                  mode === ProcessingMode.AUTO ? 'border-blue-600 bg-blue-50 shadow-xl shadow-blue-100' : 'border-slate-50 hover:border-slate-200 bg-slate-50/50'
                }`}
              >
                <div className={`p-4 rounded-2xl shadow-md ${mode === ProcessingMode.AUTO ? 'bg-blue-600 text-white' : 'bg-white text-slate-400'}`}>
                  <Sparkles className="w-6 h-6" />
                </div>
                <div>
                  <p className="font-black text-slate-800 text-base">Tự động tích hợp</p>
                  <p className="text-[11px] text-slate-500 mt-1.5 leading-relaxed font-medium">AI tự phân tích và nhúng mã năng lực số tối ưu theo ngữ cảnh bài giảng</p>
                </div>
              </button>

              <button
                onClick={() => setMode(ProcessingMode.MANUAL)}
                className={`flex items-center gap-6 p-7 rounded-[2rem] border-2 transition-all text-left relative overflow-hidden ${
                  mode === ProcessingMode.MANUAL ? 'border-blue-600 bg-blue-50 shadow-xl shadow-blue-100' : 'border-slate-50 hover:border-slate-200 bg-slate-50/50'
                }`}
              >
                <div className={`p-4 rounded-2xl shadow-md ${mode === ProcessingMode.MANUAL ? 'bg-blue-600 text-white' : 'bg-white text-slate-400'}`}>
                  <User className="w-6 h-6" />
                </div>
                <div>
                  <p className="font-black text-slate-800 text-base">Tùy chọn chỉ báo</p>
                  <p className="text-[11px] text-slate-500 mt-1.5 leading-relaxed font-medium">Bạn có quyền kiểm soát tuyệt đối các khung chỉ báo cần xuất hiện</p>
                </div>
              </button>
            </div>
          </section>

          {/* Manual Selection List */}
          {mode === ProcessingMode.MANUAL && (
            <section className="mb-12 animate-in slide-in-from-bottom-8 duration-700">
              <h2 className="text-xs font-black uppercase tracking-[0.2em] text-blue-600 mb-6 flex items-center gap-2">
                <Layers className="w-4 h-4" /> Khung năng lực số (3 cấp)
              </h2>
              <div className="space-y-4">
                {DIGITAL_COMPETENCY_FRAMEWORK.map((domain) => {
                  const isExpanded = expandedDomains.includes(domain.id);
                  const selectedCount = domain.criteria.reduce((acc, crit) => 
                    acc + crit.indicators.filter(ind => selectedIndicators.includes(ind.code)).length, 0
                  );

                  return (
                    <div key={domain.id} className="border-2 border-slate-100 rounded-3xl overflow-hidden bg-white shadow-sm transition-all hover:shadow-md">
                      <button 
                        onClick={() => toggleDomain(domain.id)}
                        className={`w-full flex items-center justify-between p-6 text-left transition-all ${isExpanded ? 'bg-slate-50' : ''}`}
                      >
                        <div className="flex items-center gap-4">
                          <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-black text-sm ${selectedCount > 0 ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-500'}`}>
                            {selectedCount > 0 ? selectedCount : domain.id.replace('NL', '')}
                          </div>
                          <span className="font-black text-slate-800 text-sm uppercase tracking-tight line-clamp-1">{domain.name}</span>
                        </div>
                        {isExpanded ? <ChevronDown className="w-5 h-5 text-slate-400" /> : <ChevronRight className="w-5 h-5 text-slate-400" />}
                      </button>

                      {isExpanded && (
                        <div className="p-4 bg-white border-t border-slate-50 animate-in fade-in duration-300">
                          {domain.criteria.map((crit) => (
                            <div key={crit.id} className="mb-8 last:mb-2">
                              <div className="flex items-center gap-2 mb-4 px-2">
                                <Target className="w-4 h-4 text-blue-400" />
                                <h4 className="text-[11px] font-black text-slate-600 uppercase tracking-tighter">{crit.name}</h4>
                              </div>
                              <div className="grid grid-cols-1 gap-2">
                                {crit.indicators.map((ind) => {
                                  const isSelected = selectedIndicators.includes(ind.code);
                                  return (
                                    <label key={ind.code} className={`group flex items-start gap-4 p-4 rounded-2xl cursor-pointer transition-all border-2 ${
                                      isSelected ? 'bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-100' : 'bg-slate-50 border-transparent hover:bg-white hover:border-blue-200'
                                    }`}>
                                      <div className="relative mt-1">
                                        <input 
                                          type="checkbox" 
                                          checked={isSelected} 
                                          onChange={() => toggleIndicator(ind.code)} 
                                          className="w-5 h-5 rounded-lg border-slate-300 text-blue-600 focus:ring-blue-500"
                                        />
                                      </div>
                                      <div>
                                        <div className="flex items-center gap-2">
                                          <span className={`text-[10px] font-black uppercase tracking-widest ${isSelected ? 'text-blue-100' : 'text-blue-600'}`}>Chỉ báo {ind.code.split('.').pop()}</span>
                                          <span className={`text-[8px] px-1.5 py-0.5 rounded-md font-bold ${isSelected ? 'bg-blue-500' : 'bg-slate-200 text-slate-500'}`}>{ind.code}</span>
                                        </div>
                                        <p className={`text-[11px] mt-1.5 leading-snug font-medium ${isSelected ? 'text-white' : 'text-slate-600'}`}>{ind.description}</p>
                                      </div>
                                    </label>
                                  );
                                })}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          <div className="sticky bottom-0 bg-white/95 backdrop-blur-xl pt-10 pb-4 border-t-2 border-slate-50 mt-10">
            <button
              disabled={!originalContent || (mode === ProcessingMode.MANUAL && selectedIndicators.length === 0) || isProcessing || isReading}
              onClick={handleProcess}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 disabled:from-slate-200 disabled:to-slate-300 disabled:shadow-none text-white font-black py-7 rounded-[2rem] flex items-center justify-center gap-4 transition-all shadow-2xl shadow-blue-200 active:scale-95 text-lg uppercase tracking-[0.25em] border-b-4 border-blue-900"
            >
              {isProcessing ? <><Loader2 className="w-6 h-6 animate-spin" /> ĐANG XỬ LÝ...</> : <><Sparkles className="w-6 h-6" /> THỰC HIỆN NGAY</>}
            </button>
          </div>
        </div>

        {/* Content Preview */}
        <div className="flex-1 flex flex-col overflow-hidden bg-[#F8FAFC]">
          <div className="px-12 py-6 bg-white border-b flex items-center justify-between shadow-sm z-10 relative">
            <h2 className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-3">
              <FileSearch className="w-5 h-5" /> BẢN XEM TRƯỚC GIÁO ÁN ĐIỆN TỬ
            </h2>
            {result && <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 border-2 border-emerald-100 px-4 py-2 rounded-2xl uppercase tracking-[0.2em] shadow-sm">Integrated successfully</span>}
          </div>
          
          <div className="flex-1 overflow-y-auto p-16 custom-scrollbar relative">
            {isProcessing ? (
              <div className="h-full flex flex-col items-center justify-center gap-10">
                <div className="relative">
                  <div className="w-40 h-40 rounded-full border-[10px] border-slate-200 border-t-blue-600 animate-spin shadow-2xl"></div>
                  <Sparkles className="absolute inset-0 m-auto w-12 h-12 text-blue-600 animate-bounce" />
                </div>
                <div className="text-center space-y-3">
                  <p className="text-3xl font-black text-slate-800 tracking-tight uppercase italic">Đang tích hợp năng lực số</p>
                  <p className="text-base text-slate-400 max-w-sm font-bold uppercase tracking-tighter">AI đang nhúng các chỉ báo năng lực số vào bài giảng của bạn...</p>
                </div>
              </div>
            ) : result ? (
              <div className="max-w-[210mm] mx-auto bg-white shadow-[0_35px_60px_-15px_rgba(0,0,0,0.1)] rounded-2xl p-[3cm] lesson-font preview-content animate-in fade-in zoom-in-95 duration-700 border border-slate-100 min-h-full">
                {previewElements}
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-20">
                <div className="w-48 h-48 bg-white rounded-[4rem] shadow-2xl flex items-center justify-center mb-12 rotate-3 border-2 border-blue-50 shadow-blue-100 relative">
                  <FileText className="w-20 h-20 text-blue-100" />
                  <div className="absolute -bottom-2 -right-2 bg-blue-600 p-4 rounded-2xl text-white shadow-lg animate-bounce">
                    <Sparkles className="w-6 h-6" />
                  </div>
                </div>
                <h3 className="text-2xl font-black text-slate-800 tracking-tight mb-6 italic uppercase">
                  Tích hợp năng lực số vào giáo án có sẵn
                </h3>
                <p className="text-slate-400 max-w-xl leading-loose font-bold text-base uppercase tracking-widest">
                  Tải tệp tin Word/PDF giáo án gốc của Thầy, cô. Hệ thống AI sẽ phân tích tiến trình dạy học và tự động tích hợp các chỉ báo năng lực số vào giáo án phù hợp nhất mà không làm thay đổi giáo án ban đầu
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 10px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #f1f5f9; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 20px; border: 3px solid #f1f5f9; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
        .preview-content { color: black; line-height: 1.5; }
        .preview-content p { font-size: 14pt; }
        .preview-content h1, .preview-content h2, .preview-content h3 { color: black; line-height: 1.2; font-weight: bold; }
        .preview-content b, .preview-content strong { font-weight: bold; }
      `}</style>
    </div>
  );
};

export default App;

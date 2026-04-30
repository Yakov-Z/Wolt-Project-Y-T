#pragma once
#include <string>
#include <fstream>
#include "IDataRepository.h"

class FileRepository : public IDataRepository {
private:
    std::string filePath;

public:
    explicit FileRepository(const std::string& path);

    void saveData(const StorageDataList& allData);

    StorageDataList loadAllData();
};